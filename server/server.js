import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';

// rest obj
const app = express();

// config env
dotenv.config();

// config db
connectDb();

// middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<h1>Welcome to My-Cart</h1>`)
} );

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/user', userRoutes);
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on mode at port ${port}.`);
})