import  express from 'express'
const app = express()
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import apiRoutes from './routes/apiRoutes/index.js'

app.use(cors())
app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//routes
app.use('/api', apiRoutes)

// Catch-all route for unmatched paths
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})