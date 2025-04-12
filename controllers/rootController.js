class RootController {
	getRoot(req, res) {
		res.json({
			status: "ok",
			message: "This is the root"
		})
	}
	// getRootV2(req, res) {
	// 	res.json({
	// 		status: "ok",
	// 		message: "This is the root v2"
	// 	})
	// }
}

export default new RootController()