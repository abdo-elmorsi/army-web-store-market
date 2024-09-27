import prisma from "lib/prisma"; // Ensure you have the correct import for your Prisma client

// Get transactions with optional filters and pagination
export const getTransactions = async (data, res) => {
  const { filter, page = 1, limit = 10 } = data; // Destructure filter from request body

  try {
    // Initialize filter object
    const transactionFilter = {};

    // Apply filters from the request body
    if (filter) {
      if (filter.productId) {
        transactionFilter.productId = filter.productId; // Match the product ID directly
      }
      if (filter.userId) {
        transactionFilter.userId = filter.userId; // Match the user ID directly
      }
      if (filter.type) {
        transactionFilter.type = filter.type; // storeIn, storeOut, marketIn, marketOut
      }
      if (filter.startDate || filter.endDate) {
        if (filter.startDate) {
          transactionFilter.createdAt = { gte: new Date(filter.startDate) }; // Filter for start date
        }
        if (filter.endDate) {
          transactionFilter.createdAt = { lte: new Date(filter.endDate) }; // Filter for end date
        }
      }
    }

    // Get total number of transactions that match the filter
    const totalTransactions = await prisma.transaction.count({
      where: transactionFilter,
    });

    // Retrieve transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where: transactionFilter,
      include: {
        product: { select: { name: true } }, // Fetch product name
        user: { select: { username: true } }, // Fetch user name
      },
      orderBy: { createdAt: 'desc' }, // Sort by createdAt, latest first
      skip: (page - 1) * limit, // Pagination: skip the previous pages
      take: Number(limit), // Limit the number of results per page
    });

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
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check stock availability for specific transaction types
    const stockCheckTypes = ["storeOut", "storeToMarket"];
    if (stockCheckTypes.includes(type) && product.quantityInStore < quantity) {
      return res.status(400).json({ message: "Insufficient stock for this operation" });
    }

    const marketCheckTypes = ["marketOut", "marketToStore"];
    if (marketCheckTypes.includes(type) && product.quantityInMarket < quantity) {
      return res.status(400).json({ message: "Insufficient stock for this operation" });
    }

    // Update product stock based on the type of transaction
    switch (type) {
      case "storeIn":
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantityInStore: product.quantityInStore + quantity, // Add stock to store
            quantityInStock: product.quantityInStock + quantity,  // Update total stock
          },
        });
        break;
      case "storeOut":
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantityInStore: product.quantityInStore - quantity, // Remove stock from store
            quantityInStock: product.quantityInStock - quantity,  // Update total stock
          },
        });
        break;
      case "storeToMarket":
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantityInStore: product.quantityInStore - quantity, // Move stock from store to market
            quantityInMarket: product.quantityInMarket + quantity, // Update market stock
          },
        });
        break;
      case "marketToStore":
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantityInMarket: product.quantityInMarket - quantity, // Move stock back from market to store
            quantityInStore: product.quantityInStore + quantity,  // Update store stock
          },
        });
        break;
      case "marketOut":
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantityInMarket: product.quantityInMarket - quantity, // Remove stock sold from market
            quantityInStock: product.quantityInStock - quantity,   // Update total stock
          },
        });
        break;
      case "marketReturn":
        await prisma.product.update({
          where: { id: productId },
          data: {
            quantityInMarket: product.quantityInMarket + quantity, // Return stock from market to store
            quantityInStock: product.quantityInStock + quantity,   // Update total stock
          },
        });
        break;
      default:
        return res.status(400).json({ message: "Unsupported transaction type" });
    }

    // Create a transaction record
    const newTransaction = await prisma.transaction.create({
      data: {
        productId,
        type,
        quantity,
        userId,
        description,
      },
    });

    return res.status(200).json({
      message: "Stock movement recorded successfully",
      product,
      transaction: newTransaction,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
