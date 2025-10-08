import request from "supertest";
import { app } from "../app";
import { getAuthToken } from "../_helpers_/authHelper";

describe("AdminConfig API", () => {
    let token: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should create or update admin config", async () => {
        const res = await request(app)
            .post("/api/admin")
            .set("Authorization", `Bearer ${token}`)
            .send({
                companyName: "PayVue Corp",
                companyAddress: "123 Main St, NY",
                companyPhone: "1234567890",
                companyEmail: "info@payvue.com",
                taxRate: 0.08,
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.companyName).toBe("PayVue Corp");
    });

    it("should fetch admin config", async () => {
        const res = await request(app)
            .get("/api/admin")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.companyEmail).toBe("info@payvue.com");
    });

    it("should update admin config when posting again", async () => {
        const res = await request(app)
            .post("/api/admin")
            .set("Authorization", `Bearer ${token}`)
            .send({
                companyName: "PayVue Inc Updated",
                companyAddress: "456 Broadway, NY",
                companyPhone: "9876543210",
                companyEmail: "support@payvue.com",
                taxRate: 0.1,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.companyName).toBe("PayVue Inc Updated");
    });

    it("should delete admin config", async () => {
        const res = await request(app)
            .delete("/api/admin")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Admin config deleted successfully");
    });

    // it("should return error when fetching deleted config", async () => {
    //     const res = await request(app)
    //         .get("/api/admin")
    //         .set("Authorization", `Bearer ${token}`);

    //     expect(res.status).toBe(400);
    //     expect(res.body.success).toBe(false);
    // });
});
