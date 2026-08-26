require("dotenv").config();

const connectDB = require("./Backend/config/db");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", require("./Backend/routes/transactionRoutes"));
app.use("/api/auth", require("./Backend/routes/authRoutes"));

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`\n=== AUTH ENDPOINTS ===`);
            console.log(`POST   http://localhost:${PORT}/api/auth/login`);
            console.log(`POST   http://localhost:${PORT}/api/auth/register`);
            console.log(`\n=== TRANSACTION ENDPOINTS ===`);
            console.log(`POST   http://localhost:${PORT}/api/transactions/createTransaction`);
            console.log(`GET    http://localhost:${PORT}/api/transactions/getAllTransactions`);
            console.log(`PUT    http://localhost:${PORT}/api/transactions/updateTransaction/:id`);
            console.log(`DELETE http://localhost:${PORT}/api/transactions/deleteTransaction/:id`);
            console.log(`\n=== TESTING TIPS ===`);
            console.log(`1. First register or login to get your token`);
            console.log(`2. Add token to headers: Authorization: Bearer <your-token>`);
            console.log(`3. Then use transaction endpoints`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exitCode = 1;
    }
};

start();