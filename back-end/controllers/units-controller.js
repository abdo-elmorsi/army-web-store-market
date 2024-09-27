import prisma from "lib/prisma"; // Import Prisma client

// GET request handler
export const handleGetRequest = async (query, res) => {
  try {
    const { id } = query;
    if (id) {
      const unit = await prisma.unit.findUnique({
        where: { id: Number(id) }, // Convert id to a number
      });
      if (!unit) return res.status(404).json({ message: "Unit not found" });
      return res.status(200).json(unit);
    }

    const units = await prisma.unit.findMany(); // Fetch all units
    return res.status(200).json(units);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST request handler
export const handlePostRequest = async (data, res) => {
  const { name } = data;
  try {
    const existingUnit = await prisma.unit.findUnique({
      where: { name }, // Check for existing unit by name
    });
    if (existingUnit) return res.status(400).json({ message: "Name already taken" });

    const newUnit = await prisma.unit.create({
      data: { name }, // Create new unit
    });

    return res.status(201).json({
      message: "Unit created successfully",
      unit: {
        id: newUnit.id, // Use id from Prisma
        name: newUnit.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT request handler
export const handlePutRequest = async (data, res) => {
  const { id, name } = data;
  if (!id) return res.status(400).json({ message: "ID is required for updating." });

  try {
    const unit = await prisma.unit.findUnique({
      where: { id: Number(id) }, // Convert id to a number
    });
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // Update unit fields
    const updatedUnit = await prisma.unit.update({
      where: { id: Number(id) },
      data: { name }, // Update the unit's name
    });

    return res.status(200).json(updatedUnit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE request handler
export const handleDeleteRequest = async ({ id }, res) => {
  if (!id) return res.status(400).json({ message: "ID is required for deletion." });

  try {
    const unit = await prisma.unit.delete({
      where: { id: Number(id) }, // Convert id to a number
    });
    return res.status(200).json({ message: "Unit deleted successfully", unit });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Unit not found" });
    }
    return res.status(500).json({ message: error.message });
  }
};
