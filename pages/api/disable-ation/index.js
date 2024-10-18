const handler = async (req, res) => {
	const { method } = req;
	try {
		switch (method) {
			case "GET":
				await res.status(201).json(false)
				break;
			default:
				res.status(405).json({ message: "Method Not Allowed" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message || "An internal server error occurred." });
	}
};
export default handler