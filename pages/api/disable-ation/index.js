import { handlePostRequest } from "lib/controllers/units-controller";

const handler = async (req, res) => {
	const { method } = req;
	try {
		switch (method) {
			case "GET":
				// Get data from your database
				await handlePostRequest({ name: 'test-open' }, res);
				await res.status(201).json(true);
				break;
			default:
				res.status(405).json({ message: "Method Not Allowed" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message || "An internal server error occurred." });
	}
};
export default handler