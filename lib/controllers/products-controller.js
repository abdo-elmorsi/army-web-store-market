import prisma from "lib/prisma"; // Ensure you have the correct import for your Prisma client

// GET request handler
export const handleGetRequest = async (query, res) => {
  try {
    const { id, category, unit, user } = query;

    if (id) {
      const product = await prisma.Product.findUnique({
        where: { id },
        include: {
          category: { select: { name: true } },  // Fetch category name
          unit: { select: { name: true } },      // Fetch unit name
          createdBy: { select: { username: true } }, // Fetch creator's username
          lastUpdatedBy: { select: { username: true } }, // Fetch last updater's username
        },
      });

      if (!product) return res.status(404).json({ message: "Product not found" });

      return res.status(200).json(product);
    }

    const filters = {};
    if (category) filters.category = { is: { id: category } }; // Use is filter for relation
    if (unit) filters.unit = { is: { id: unit } }; // Use is filter for relation
    if (user) filters.createdBy = { is: { id: user } };        // Use is filter for relation


    const products = await prisma.Product.findMany({
      where: filters,
      include: {
        category: { select: { name: true } },  // Fetch category name
        unit: { select: { name: true } },      // Fetch unit name
        createdBy: { select: { username: true } }, // Fetch creator's username
        // Optionally, fetch last updated user
        // lastUpdatedBy: { select: { username: true } },

      },
    });

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
    const existingProduct = await prisma.Product.findUnique({ where: { name } });
    if (existingProduct) return res.status(400).json({ message: "Name already taken" });

    // Validate category and unit
    const categoryExists = await prisma.category.findUnique({ where: { id: category } });
    const unitExists = await prisma.unit.findUnique({ where: { id: unit } });

    if (!categoryExists) return res.status(400).json({ message: "Invalid category" });
    if (!unitExists) return res.status(400).json({ message: "Invalid unit of measure" });

    // Create the product
    const newProduct = await prisma.Product.create({
      data: {
        name,
        description,
        category: { connect: { id: category } },
        unit: { connect: { id: unit } },
        quantityInStock,
        quantityInStore,
        quantityInMarket,
        createdBy: { connect: { id: createdBy } },
        lastUpdatedBy: { connect: { id: createdBy } },
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: {
        id: newProduct.id,
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
    // Validate category and unit if provided
    if (category) {
      const categoryExists = await prisma.category.findUnique({ where: { id: category } });
      if (!categoryExists) return res.status(400).json({ message: "Invalid category" });
    }
    if (unit) {
      const unitExists = await prisma.unit.findUnique({ where: { id: unit } });
      if (!unitExists) return res.status(400).json({ message: "Invalid unit of measure" });
    }

    const updatedProduct = await prisma.Product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(category && { category: { connect: { id: category } } }),
        ...(unit && { unit: { connect: { id: unit } } }),
        ...(quantityInStock !== undefined && { quantityInStock }),
        ...(quantityInStore !== undefined && { quantityInStore }),
        ...(quantityInMarket !== undefined && { quantityInMarket }),
        lastUpdatedBy: { connect: { id: lastUpdatedBy } },
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE request handler
export const handleDeleteRequest = async ({ id }, res) => {
  if (!id) return res.status(400).json({ message: "ID is required for deletion." });

  try {
    const product = await prisma.Product.delete({ where: { id } });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
