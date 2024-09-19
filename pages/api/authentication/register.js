import connectMongoDB from "back-end/server/mongodb";
import { handleRegister } from "back-end/controllers/auth-controller";


export default async (req, res) => {

	const { method, body } = req;
	const { username, password, role } = body;

	try {
		await connectMongoDB();
		if (method === "POST") {
			await handleRegister(username, password, role, res);
		} else {
			res.status(405).json({ message: "Method Not Allowed" });
		}
	} catch (error) {
		console.error("Error processing request:", error);
		res.status(500).json({ message: error.message || "An internal server error occurred." });
	}
};