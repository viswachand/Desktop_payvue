import request from "supertest";
import { app } from "../app";
import { getAuthToken } from "../_helpers_/authHelper";

describe("Category API", () => {
    let token: string;
    let categoryId: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    // ---------------- Create ----------------
    it("should create a category", async () => {
        const res = await request(app)
            .post("/api/categories")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Rings" });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Rings");
        categoryId = res.body.data.id;
    });

    // ---------------- Read All ----------------
    it("should fetch all categories", async () => {
        const res = await request(app)
            .get("/api/categories")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // ---------------- Read by ID ----------------
    it("should fetch a category by ID", async () => {
        const res = await request(app)
            .get(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(categoryId);
        expect(res.body.data.name).toBe("Rings"); // name before update
    });

    // ---------------- Update ----------------
    it("should update a category", async () => {
        const res = await request(app)
            .put(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Necklaces" });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("Necklaces");
    });

    // ---------------- Delete ----------------
    it("should delete a category", async () => {
        const res = await request(app)
            .delete(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Category deleted successfully");
    });

    // ---------------- Verify Deletion ----------------
    it("should return error for deleted category", async () => {
        const res = await request(app)
            .get(`/api/categories/${categoryId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400); // since controller throws BadRequestError
        expect(res.body.success).toBe(false);
    });
});
