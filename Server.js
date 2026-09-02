require("dotenv").config();

const connectDB = require("./Backend/config/db");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

const swaggerFilePath = path.join(__dirname, "swagger-output.json");
if (fs.existsSync(swaggerFilePath)) {
    const swaggerDocument = require(swaggerFilePath);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
    console.warn(
        "swagger-output.json not found. Run `npm run swagger` to generate API documentation."
    );
}

app.use("/api/transactions", require("./Backend/routes/transactionRoutes"));
app.use("/api/auth", require("./Backend/routes/authRoutes"));
app.use("/api/groups", require("./Backend/routes/groupRoutes"));
app.use("/api/groupExpenses", require("./Backend/routes/groupExpenseRoutes"));
app.use("/api/settlement", require("./Backend/routes/settlementRoutes"));
app.use("/api/budgets", require("./Backend/routes/budgetRoutes"));

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            if (fs.existsSync(swaggerFilePath)) {
                console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
            }
            console.log(`\n=== AUTH ENDPOINTS ===`);
            console.log(`POST   http://localhost:${PORT}/api/auth/login`);
            console.log(`POST   http://localhost:${PORT}/api/auth/register`);
            console.log(`\n=== TRANSACTION ENDPOINTS ===`);
            console.log(`POST   http://localhost:${PORT}/api/transactions/createTransaction`);
            console.log(`GET    http://localhost:${PORT}/api/transactions/getAllTransactions`);
            console.log(`PUT    http://localhost:${PORT}/api/transactions/updateTransaction/:id`);
            console.log(`DELETE http://localhost:${PORT}/api/transactions/deleteTransaction/:id`);
            console.log(`\n=== GROUP ENDPOINTS ===`);
            console.log(`POST   http://localhost:${PORT}/api/groups/createGroup`);
            console.log(`GET    http://localhost:${PORT}/api/groups/getGroups`);
            console.log(`POST   http://localhost:${PORT}/api/groups/addMember/:id`);
            console.log(`\n=== GROUP EXPENSE ENDPOINTS ===`);
            console.log(`POST   http://localhost:${PORT}/api/groupExpenses/addExpense/:groupId`);
            console.log(`GET    http://localhost:${PORT}/api/groupExpenses/getExpenses/:groupId`);
            console.log(`\n=== SETTLEMENT ENDPOINTS ===`);
            console.log(`GET    http://localhost:${PORT}/api/settlement/calculateSettlement/:groupId`);
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