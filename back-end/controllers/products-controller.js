import Products from "back-end/models/products-model";
import Users from "back-end/models/users-model"; // Assuming you have a unit of measure model
import Categories from "back-end/models/categories-model"; // Assuming you have a category model
import Units from "back-end/models/units-model"; // Assuming you have a unit of measure model

// GET request handler
export const handleGetRequest = async (query, res) => {
  try {
    const { id, category, user } = query;

    if (id) {
      const product = await Products.findById(id)
        .populate({
          path: "category",
          select: "name", // Include only name from category
        })
        .populate({
          path: "unit",
          select: "name", // Include only name from unit
        })
        .populate({
          path: "createdBy",
          select: "username", // Include username from createdBy
        })
        .populate({
          path: "lastUpdatedBy",
          select: "username", // Include username from lastUpdatedBy
        });

      if (!product) return res.status(404).json({ message: "Product not found" });

      return res.status(200).json(product);
    }

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (user) {
      filter.createdBy = user;
    }

    const products = await Products.find(filter)
      .populate({
        path: "category",
        select: "name", // Include only name from category
      })
      .populate({
        path: "unit",
        select: "name", // Include only name from unit
      })
      .populate({
        path: "createdBy",
        select: "username", // Include username from createdBy
      })
    // .populate({
    //   path: "lastUpdatedBy",
    //   select: "username", // Include username from lastUpdatedBy
    // });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// POST request handler
export const handlePostRequest = async (data, res) => {
  const { name, description, category, quantityInStock, quantityInStore, quantityInMarket, unit, createdBy } = data;

  try {
    // Check for existing product by name
    const existingProduct = await Products.findOne({ name });
    if (existingProduct) return res.status(400).json({ message: "Name already taken" });

    // Validate the category and unit
    const categoryExists = await Categories.findById(category);
    const unitExists = await Units.findById(unit);

    if (!categoryExists) return res.status(400).json({ message: "Invalid category" });
    if (!unitExists) return res.status(400).json({ message: "Invalid unit of measure" });

    // Create the product
    const newProduct = await Products.create({
      name,
      description,
      category,
      quantityInStock,
      quantityInStore,
      quantityInMarket,
      unit,
      createdBy,
      lastUpdatedBy: createdBy, // Initially, the creator is also the last person who updated it
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: {
        id: newProduct._id,
        name: newProduct.name,
        category: newProduct.category,
        quantityInStock: newProduct.quantityInStock,
        quantityInStore: newProduct.quantityInStore,
        quantityInMarket: newProduct.quantityInMarket,
        unit: newProduct.unit,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT request handler
export const handlePutRequest = async (data, res) => {
  const { id, name, description, category, quantityInStock, quantityInStore, quantityInMarket, unit, lastUpdatedBy } = data;

  if (!id) return res.status(400).json({ message: "ID is required for updating." });

  try {
    // Find the product
    const product = await Products.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) {
      const categoryExists = await Categories.findById(category);
      if (!categoryExists) return res.status(400).json({ message: "Invalid category" });
      product.category = category;
    }
    if (unit) {
      const unitExists = await Units.findById(unit);
      if (!unitExists) return res.status(400).json({ message: "Invalid unit of measure" });
      product.unit = unit;
    }

    if (quantityInStock !== undefined) product.quantityInStock = quantityInStock;
    if (quantityInStore !== undefined) product.quantityInStore = quantityInStore;
    if (quantityInMarket !== undefined) product.quantityInMarket = quantityInMarket;

    product.lastUpdatedBy = lastUpdatedBy; // Track the user who updated the product

    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE request handler
export const handleDeleteRequest = async ({ id }, res) => {
  if (!id) return res.status(400).json({ message: "ID is required for deletion." });

  try {
    const product = await Products.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
