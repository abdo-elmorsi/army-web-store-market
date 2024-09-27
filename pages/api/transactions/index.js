import { getTransactions, handleStockMovement } from "lib/controllers/transactions-controller";

const handler = async (req, res) => {
  const { method, body } = req;
  try {
    switch (method) {
      case "GET":
        await getTransactions(body, res);
        break;
      case "POST":
        await handleStockMovement(body, res);
        break;;
      default:
        res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "An internal server error occurred." });
  }
};
export default handler