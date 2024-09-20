import Categories from "back-end/models/categories-model";


// GET request handler
export const handleGetRequest = async (query, res) => {
  try {
    const { id } = query;
    if (id) {
      const categorie = await Categories.findById(id);
      if (!categorie) return res.status(404).json({ message: "Categorie not found" });
      return res.status(200).json(categorie);
    }

    const categories = await Categories.find({});
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST request handler
export const handlePostRequest = async (data, res) => {
  const { name } = data;
  try {
    const existingCategorie = await Categories.findOne({ name });
    if (existingCategorie) return res.status(400).json({ message: "Name already taken" });

    const newCategorie = await Categories.create({ name });

    return res.status(201).json({
      message: "Categorie created successfully",
      categorie: {
        id: newCategorie._id,
        name: newCategorie.name,
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
    const categorie = await Categories.findById(id);
    if (!categorie) return res.status(404).json({ message: "Categorie not found" });


    // Update categorie fields
    if (name) categorie.name = name;
    await categorie.save();
    return res.status(200).json(categorie);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE request handler
export const handleDeleteRequest = async ({ id }, res) => {
  if (!id) return res.status(400).json({ message: "ID is required for deletion." });

  try {
    const categorie = await Categories.findByIdAndDelete(id);
    if (!categorie) return res.status(404).json({ message: "Categorie not found" });
    return res.status(200).json({ message: "Categorie deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};