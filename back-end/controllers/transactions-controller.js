import Products from "back-end/models/products-model";
import Transactions from "back-end/models/transactions-model";
import Users from "back-end/models/users-model";


// Get transactions with optional filters and pagination
export const getTransactions = async (data, res) => {
  const { filter, page = 1, limit = 10 } = data; // Destructure filter from request body

  try {
    // Initialize filter object
    const transactionFilter = {};

    // Apply filters from the request body
    if (filter) {
      if (filter.productId) {
        transactionFilter.product = filter.productId;
      }
      if (filter.userId) {
        transactionFilter.user = filter.userId;
      }
      if (filter.type) {
        transactionFilter.type = filter.type; // storeIn, storeOut, marketIn, marketOut
      }
      if (filter.startDate || filter.endDate) {
        transactionFilter.date = {};
        if (filter.startDate) {
          transactionFilter.date.$gte = new Date(filter.startDate);
        }
        if (filter.endDate) {
          transactionFilter.date.$lte = new Date(filter.endDate);
        }
      }
    }

    // Get total number of transactions that match the filter
    const totalTransactions = await Transactions.countDocuments(transactionFilter);

    // Retrieve transactions with pagination
    const transactions = await Transactions.find(transactionFilter)
      .populate("product", "name") // Populate product name
      .populate("user", "username") // Populate user name
      .sort({ date: -1 }) // Sort by date, latest first
      .skip((page - 1) * limit) // Pagination: skip the previous pages
      .limit(Number(limit)); // Limit the number of results per page

    return res.status(200).json({
      message: "Transactions retrieved successfully",
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions, // Include total count of transactions
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Handle stock movement
export const handleStockMovement = async (data, res) => {
  const { productId, type, quantity, userId, description } = data;

  // Validate transaction type
  const validTypes = [
    "storeIn",       // Add stock to the store
    "storeOut",      // Return stock to the supplier or remove from the store
    "storeToMarket",  // Move stock from the store to the market
    "marketToStore",  // Move stock from the market back to the store
    "marketOut",     // Sell stock from the market
    "marketReturn"   // Return sold items from the market back to the store
  ];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid transaction type" });
  }

  // Validate quantity
  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than zero" });
  }

  try {
    // Find the product
    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });


    // Check stock availability for specific transaction types
    const stockCheckTypes = ["storeOut", "storeToMarket"];
    if (stockCheckTypes.includes(type) && product.quantityInStore < quantity) {
      return res.status(400).json({ message: "Insufficient stock for this operation" });
    }
    // Check stock availability for specific transaction types
    const marketCheckTypes = ["marketOut", "marketToStore"];
    if (marketCheckTypes.includes(type) && product.quantityInMarket < quantity) {
      return res.status(400).json({ message: "Insufficient stock for this operation" });
    }



    // Update product stock based on the type of transaction
    switch (type) {
      case "storeIn":
        product.quantityInStore += quantity; // Add stock to store
        product.quantityInStock += quantity;  // Update total stock
        break;
      case "storeOut":
        product.quantityInStore -= quantity; // Remove stock from store
        product.quantityInStock -= quantity;  // Update total stock
        break;
      case "storeToMarket":
        product.quantityInStore -= quantity; // Move stock from store to market
        product.quantityInMarket += quantity; // Update market stock
        break;
      case "marketToStore":
        product.quantityInMarket -= quantity; // Move stock back from market to store
        product.quantityInStore += quantity;  // Update store stock
        break;
      case "marketOut":
        product.quantityInMarket -= quantity; // Remove stock sold from market
        product.quantityInStock -= quantity;   // Update total stock
        break;
      case "marketReturn":
        product.quantityInMarket += quantity; // Return stock from market to store
        product.quantityInStock += quantity;   // Update total stock
        break;
      default:
        return res.status(400).json({ message: "Unsupported transaction type" });
    }

    // Save the updated product
    await product.save();

    // Create a transaction record
    const newTransaction = await Transactions.create({
      product: productId,
      type,
      quantity,
      user: userId,
      description
    });

    return res.status(200).json({
      message: "Stock movement recorded successfully",
      product,
      transaction: newTransaction
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
