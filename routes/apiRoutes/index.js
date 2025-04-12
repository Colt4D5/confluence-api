import app from 'express'
const router = app.Router()

// controllers
import rootController from '../../controllers/rootController.js'

// routes
router
	.route('/v1')
		.get(rootController.getRoot)

// router
// 	.route('/v2')
// 		.get(rootController.getRootV2)

export default router