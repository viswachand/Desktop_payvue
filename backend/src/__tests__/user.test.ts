import request from "supertest";
import { app } from "../app";
import { getAuthToken } from "../_helpers_/authHelper";

describe("User API", () => {
    let token: string;
    let userId: string;

    const userPayload = {
        username: "john_doe",
        firstName: "John",
        lastName: "Doe",
        password: "secret123",
        employeeStartDate: "2024-01-01",
        contactNumber: "1234567890",
        isAdmin: true,
    };

    // ---------------- Sign Up ----------------
    it("should sign up a new user", async () => {
        const res = await request(app).post("/api/users/signup").send(userPayload);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.username).toBe(userPayload.username);
        userId = res.body.data.id;
    });

    // ---------------- Login ----------------
    it("should log in the user", async () => {
        const res = await request(app).post("/api/users/login").send({
            username: userPayload.username,
            password: userPayload.password,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();
        token = res.body.data.token;
    });

    // ---------------- Current User ----------------
    it("should get the current user", async () => {
        const freshToken = await getAuthToken();

        const res = await request(app)
            .get("/api/users/currentuser")
            .set("Authorization", `Bearer ${freshToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.username).toBeDefined();
    });

    // ---------------- Get All Users ----------------
    it("should fetch all users", async () => {
        const freshToken = await getAuthToken();

        const res = await request(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${freshToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // ---------------- Get User by ID ----------------
    it("should fetch user by ID", async () => {
        const freshToken = await getAuthToken();

        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set("Authorization", `Bearer ${freshToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(userId);
    });

    // ---------------- Update User ----------------
    it("should update a user", async () => {
        const freshToken = await getAuthToken();

        const res = await request(app)
            .put(`/api/users/update/${userId}`)
            .set("Authorization", `Bearer ${freshToken}`)
            .send({ firstName: "Johnny" });

        expect(res.status).toBe(200);
        expect(res.body.data.firstName).toBe("Johnny");
    });

    // ---------------- Delete User ----------------
    it("should delete a user", async () => {
        const freshToken = await getAuthToken();

        const res = await request(app)
            .delete(`/api/users/${userId}`)
            .set("Authorization", `Bearer ${freshToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("User deleted successfully");
    });
});
