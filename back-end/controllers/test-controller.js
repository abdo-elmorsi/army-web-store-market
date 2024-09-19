import Test from "back-end/models/test-model";

// Helper function to validate title
const validateTitle = (title, res) => {
  if (!title || typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ message: "Title is required and must be a non-empty string." });
    return false;
  }
  return true;
};

// GET request handler
export const handleGetRequest = async (id, res) => {
  if (id) {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(200).json({ message: "Test fetched successfully", data: test });
  }

  const tests = await Test.find({});
  return res.status(200).json({ message: "Tests fetched successfully", data: tests });
};

// POST request handler
export const handlePostRequest = async (title, description, res) => {
  if (!validateTitle(title, res)) return;

  const newTest = await Test.create({ title, description });
  return res.status(201).json({ message: "Test created successfully", data: newTest });
};

// PUT request handler
export const handlePutRequest = async (id, title, description, res) => {
  if (!id) {
    return res.status(400).json({ message: "ID is required for updating." });
  }
  if (!validateTitle(title, res)) return;

  const updatedTest = await Test.findByIdAndUpdate(id, { title, description }, { new: true });
  if (!updatedTest) {
    return res.status(404).json({ message: "Test not found" });
  }

  return res.status(200).json({ message: "Test updated successfully", data: updatedTest });
};

// DELETE request handler
export const handleDeleteRequest = async (id, res) => {
  if (!id) {
    return res.status(400).json({ message: "ID is required for deletion." });
  }

  const deletedTest = await Test.findByIdAndDelete(id);
  if (!deletedTest) {
    return res.status(404).json({ message: "Test not found" });
  }

  return res.status(200).json({ message: "Test deleted successfully" });
};
