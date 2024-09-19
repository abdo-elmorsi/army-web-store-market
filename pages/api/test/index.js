import connectMongoDB from "back-end/server/mongodb";
import { handleDeleteRequest, handleGetRequest, handlePostRequest, handlePutRequest } from "back-end/controllers/test-controller";

export default async (req, res) => {

	const { method, query, body } = req;
	const { id } = query;
	const { title, description } = body;

	try {
		await connectMongoDB();
		switch (method) {
			case "GET":
				await handleGetRequest(id, res);
				break;

			case "POST":
				await handlePostRequest(title, description, res);
				break;

			case "PUT":
				await handlePutRequest(id, title, description, res);
				break;

			case "DELETE":
				await handleDeleteRequest(id, res);
				break;

			default:
				res.status(405).json({ message: "Method Not Allowed" });
		}
	} catch (error) {
		console.error("Error processing request:", error);
		res.status(500).json({ message: error.message || "An internal server error occurred." });
	}
};
