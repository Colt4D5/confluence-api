import  express from 'express'
const app = express()
const port = process.env.PORT || 3000
import { initMiddleware } from './middleware/index.js'

import apiRoutes from './routes/apiRoutes/index.js'

// middleware
initMiddleware(app)

//routes
app.use('/api', apiRoutes)

// catch-all route for unmatched paths
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})