import express from "express"
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js"
import businessRoutes from "./routes/business.routes.js"
import customerRoutes from "./routes/customer.routes.js"
import paymentRoutes from "./routes/payment.routes.js"

connectDB();

const app = express()


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.Client_URI || "http://localhost:5173",
    credentials: true,
  }));

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send('server is working')
})

app.use('/api/auth', authRoutes)
app.use("/api/admin", adminRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/customer/payment", paymentRoutes);

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})