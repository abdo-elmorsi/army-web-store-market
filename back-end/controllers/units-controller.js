import Units from "back-end/models/units-model";


// GET request handler
export const handleGetRequest = async (query, res) => {
  try {
    const { id } = query;
    if (id) {
      const unit = await Units.findById(id);
      if (!unit) return res.status(404).json({ message: "Unit not found" });
      return res.status(200).json(unit);
    }

    const units = await Units.find({});
    return res.status(200).json(units);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST request handler
export const handlePostRequest = async (data, res) => {
  const { name } = data;
  try {
    const existingUnit = await Units.findOne({ name });
    if (existingUnit) return res.status(400).json({ message: "Name already taken" });

    const newUnit = await Units.create({ name });

    return res.status(201).json({
      message: "Unit created successfully",
      unit: {
        id: newUnit._id,
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
    const unit = await Units.findById(id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });


    // Update unit fields
    if (name) unit.name = name;
    await unit.save();
    return res.status(200).json(unit);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE request handler
export const handleDeleteRequest = async ({ id }, res) => {
  if (!id) return res.status(400).json({ message: "ID is required for deletion." });

  try {
    const unit = await Units.findByIdAndDelete(id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    return res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};