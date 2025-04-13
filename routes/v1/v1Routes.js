import app from 'express'
const router = app.Router()

// controllers
import searchController from '../../controllers/v1/searchController.js'
import tagsController from '../../controllers/v1/tagsController.js'

// routes
router
  .route('/search/:query')
    .get(searchController.fetchDocs.bind(searchController))

router
	.route('/search/id/:id')
		.get(searchController.fetchDocById.bind(searchController))

router
  .route('/search/id/:id/tags')
    .post(tagsController.addTags.bind(tagsController))
    .delete(tagsController.deleteTag.bind(tagsController))

router
  .route('/tags')
    .get(tagsController.getTagsByDocId.bind(tagsController))

export default router