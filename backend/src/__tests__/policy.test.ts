import request from "supertest";
import { app } from "../app";
import { getAuthToken } from "../_helpers_/authHelper";

describe("Policy API", () => {
    let token: string;
    let policyId: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    // ---------------- Create ----------------
    it("should create a policy", async () => {
        const res = await request(app)
            .post("/api/policies")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Return Policy",
                description: "Items can be returned within 30 days",
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe("Return Policy");
        policyId = res.body.data.id;
    });

    // ---------------- Read All ----------------
    it("should fetch all policies", async () => {
        const res = await request(app)
            .get("/api/policies")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // ---------------- Read by ID ----------------
    it("should fetch a policy by ID", async () => {
        const res = await request(app)
            .get(`/api/policies/${policyId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(policyId);
        expect(res.body.data.title).toBe("Return Policy");
    });

    // ---------------- Update ----------------
    it("should update a policy", async () => {
        const res = await request(app)
            .put(`/api/policies/${policyId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ description: "Items can be returned/exchanged in 45 days" });

        expect(res.status).toBe(200);
        expect(res.body.data.description).toContain("45 days");
    });

    // ---------------- Delete ----------------
    it("should delete a policy", async () => {
        const res = await request(app)
            .delete(`/api/policies/${policyId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Policy deleted successfully");
    });

    // ---------------- Verify Deletion ----------------
    it("should return error when fetching deleted policy", async () => {
        const res = await request(app)
            .get(`/api/policies/${policyId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400); // BadRequestError
        expect(res.body.success).toBe(false);
    });
});
