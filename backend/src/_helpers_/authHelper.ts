import request from "supertest";
import { app } from "../app";

export const getAuthToken = async (): Promise<string> => {
    // 1. Sign up a test user
    await request(app).post("/api/users/signup").send({
        username: "test_user",
        firstName: "Test",
        lastName: "User",
        password: "secret123",
        employeeStartDate: "2024-01-01",
        contactNumber: "1234567890",
        isAdmin: true,
    });

    // 2. Login and return token
    const res = await request(app).post("/api/users/login").send({
        username: "test_user",
        password: "secret123",
    });

    return res.body?.data?.token;
};
