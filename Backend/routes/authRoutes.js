const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', (req, res) => {
  /*
  #swagger.tags = ['Auth']
  #swagger.summary = 'Register a new user'
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" }
              }
            }
          }
        }
     }
  #swagger.responses[201] = {
        description: "User registered successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AuthResponse" }
          }
        }
     }
  #swagger.responses[400] = {
        description: "User already exists",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorMessage" }
          }
        }
     }
  */
  return register(req, res);
});

router.post('/login', (req, res) => {
  /*
  #swagger.tags = ['Auth']
  #swagger.summary = 'Login with email and password'
  #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "password123" }
              }
            }
          }
        }
     }
  #swagger.responses[200] = {
        description: "Login successful",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AuthResponse" }
          }
        }
     }
  #swagger.responses[401] = {
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorMessage" }
          }
        }
     }
  */
  return login(req, res);
});

module.exports = router;
