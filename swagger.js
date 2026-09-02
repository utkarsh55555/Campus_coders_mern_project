require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const port = process.env.PORT || 5000;

const doc = {
  info: {
    version: "1.0.0",
    title: "Campus Coders Finance API",
    description:
      "REST API for personal finance, budgets, groups, and expense settlements.",
  },
  host: `localhost:${port}`,
  schemes: ["http"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      AuthResponse: {
        type: "object",
        properties: {
          _id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        },
      },
      ErrorMessage: {
        type: "object",
        properties: {
          message: { type: "string", example: "Something went wrong" },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          type: { type: "string", enum: ["income", "expense"] },
          amount: { type: "number", example: 150.5 },
          description: { type: "string", example: "Groceries" },
          category: { type: "string", example: "Food" },
          date: { type: "string", format: "date-time" },
          notes: { type: "string", example: "Weekly shopping" },
        },
      },
      Group: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string", example: "Roommates" },
          description: { type: "string", example: "Shared apartment expenses" },
          members: {
            type: "array",
            items: { type: "string" },
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Budget: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          limit: { type: "number", example: 500 },
          category: { type: "string", example: "Food" },
          spent: { type: "number", example: 120 },
          remaining: { type: "number", example: 380 },
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
        },
      },
      GroupExpense: {
        type: "object",
        properties: {
          _id: { type: "string" },
          groupId: { type: "string" },
          amount: { type: "number", example: 75 },
          description: { type: "string", example: "Dinner" },
          paidBy: { type: "string" },
          date: { type: "string", format: "date-time" },
        },
      },
      SettlementResult: {
        type: "object",
        properties: {
          total: { type: "number", example: 300 },
          share: { type: "number", example: 100 },
          result: {
            type: "array",
            items: {
              type: "object",
              properties: {
                user: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                balance: { type: "number", example: 50 },
              },
            },
          },
        },
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./Server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
