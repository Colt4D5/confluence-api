import app from 'express'
const router = app.Router()

import v1Routes from '../v1/v1Routes.js'
// import v2Routes from '../v1/v2Routes.js'

// routes
router.use('/v1', v1Routes)
// router.use('/v2', v2Routes)

export default router