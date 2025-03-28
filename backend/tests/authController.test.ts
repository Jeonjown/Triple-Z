// authController.test.ts

// Set NODE_ENV to 'test' so that DB connection logs are disabled during tests
process.env.NODE_ENV = "test";

import { Request, Response, NextFunction } from "express";
import {
  checkAuth,
  jwtLogin,
  jwtSignup,
  logoutUser,
} from "../controllers/authController";

// --- Mock external dependencies ---
jest.mock("../models/userModel");
jest.mock("../utils/hashPassword");
jest.mock("../utils/generateToken");
jest.mock("../utils/createError");

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // Reset request, response and next mocks for each test
    req = { body: {}, cookies: {} };
    res = {
      cookie: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // enables chaining like res.status(200).json(...)
      clearCookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // --- Test jwtSignup ---
  describe("jwtSignup", () => {
    it("should call next with error if required fields are missing", async () => {
      req.body = {}; // No fields provided
      await jwtSignup(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled(); // Expect an error to be passed to next()
    });

    // Further tests can be added here:
    // - Mocking User.findOne for duplicate username/email scenarios
    // - Testing password mismatch
    // - Testing successful signup flow by mocking hashPassword, generateToken, and newUser.save()
  });

  // --- Test jwtLogin ---
  describe("jwtLogin", () => {
    it("should call next with error if email is missing", async () => {
      req.body = { password: "123456" }; // Missing email
      await jwtLogin(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    // Further tests:
    // - Missing password
    // - User not found (User.findOne returning null)
    // - Incorrect password (mocking bcrypt.compare)
    // - Successful login by mocking required functions
  });

  // --- Test checkAuth ---
  describe("checkAuth", () => {
    it("should respond with the user present in req.user", () => {
      // Simulate authenticated request
      req.user = { id: "123", username: "testUser", role: "user" };
      checkAuth(req as any, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: req.user });
    });
  });

  // --- Test logoutUser ---
  describe("logoutUser", () => {
    it("should call next with error if auth_token cookie is missing", async () => {
      req.cookies = {}; // No auth_token present
      await logoutUser(req as any, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it("should clear the cookie and respond with success if auth_token exists", async () => {
      req.cookies = { auth_token: "sampleToken" };
      await logoutUser(req as any, res as Response, next);
      expect(res.clearCookie).toHaveBeenCalledWith(
        "auth_token",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logged out Successfully",
      });
    });
  });
});
