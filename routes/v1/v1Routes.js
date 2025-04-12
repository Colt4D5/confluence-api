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
  .route('/tags')
    .get(tagsController.getTagsByDocId.bind(tagsController))

// router
//   .route('/tags/:tag')
//     .get(searchController.fetchDocsByTag.bind(searchController))
//     .post(searchController.addTag.bind(searchController)) 
//     .delete(searchController.deleteTag.bind(searchController)) 
    // .put(searchController.updateTag.bind(searchController))

export default router