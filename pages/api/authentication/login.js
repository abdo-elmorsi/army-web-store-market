import { handleLogin } from "back-end/controllers/auth-controller";
import connectMongoDB from "back-end/server/mongodb";


const handler = async (req, res) => {
	const { method, body } = req;
	const { username, password } = body;
	try {
		await connectMongoDB();
		if (method === "POST") {
			await handleLogin(username, password, res);
		} else {
			res.status(405).json({ message: "Method Not Allowed" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message || "An internal server error occurred." });
	}
};
export default handler;