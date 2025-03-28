// jest.setup.ts
jest.setTimeout(15000); // Increase timeout to 15 seconds
process.env.NODE_ENV = "test"; // Override environment for tests

import mongoose from "mongoose";
afterAll(async () => {
  await mongoose.disconnect();
});
