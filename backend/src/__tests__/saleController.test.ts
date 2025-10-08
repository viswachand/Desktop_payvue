import request from "supertest";
import { app } from "../app";
import { getAuthToken } from "../_helpers_/authHelper";

describe("💰 Sale API", () => {
    let token: string;
    let saleId: string;
    let itemId: string;

    beforeAll(async () => {
        token = await getAuthToken();

        const adminRes = await request(app)
            .post("/api/admin")
            .set("Authorization", `Bearer ${token}`)
            .send({
                companyName: "PayVue Test Corp",
                companyAddress: "123 Main St",
                companyPhone: "1234567890",
                companyEmail: "info@payvue.com",
                taxRate: 0.08,
            });

        expect([200, 201]).toContain(adminRes.status);

        const itemRes = await request(app)
            .post("/api/items")
            .set("Authorization", `Bearer ${token}`)
            .send({
                itemSKU: "SKU-999",
                itemName: "Gold Necklace",
                itemDescription: "22K Gold Chain Necklace",
                itemCategory: "68de8ad92419602685ec48f4",
                costPrice: 800,
                unitPrice: 1500,
                quantity: 5,
                vendor: "Malabar Gold",
            });

        expect(itemRes.status).toBe(201);
        itemId = itemRes.body.data.id;
    });

    /* ------------------ CREATE SALE ------------------ */
    it("should create a sale successfully", async () => {
        const res = await request(app)
            .post("/api/sale")
            .set("Authorization", `Bearer ${token}`)
            .send({
                customerInformation: { firstName: "John", phone: "5551234" },
                items: [{ type: "inventory", itemId }],
                discountTotal: 50,
                installments: [{ amount: 200, method: "cash" }],
                policyTitle: "Standard Sale Policy",
                policyDescription: "No refunds after 7 days",
                isLayaway: true,
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Sale created successfully");
        expect(res.body.data.invoiceNumber).toMatch(/^VCR-/);
        expect(res.body.data.total).toBeGreaterThan(0);
        expect(["installment", "paid"]).toContain(res.body.data.status);

        saleId = res.body.data.id;
    });

    /* ------------------ VALIDATIONS ------------------ */
    it("should fail if customer info is incomplete", async () => {
        const res = await request(app)
            .post("/api/sale")
            .set("Authorization", `Bearer ${token}`)
            .send({
                customerInformation: { firstName: "John" },
                items: [{ type: "inventory", itemId }],
                policyTitle: "Policy",
                policyDescription: "Desc",
            });

        expect(res.status).toBe(400);
        expect(res.body.errors?.[0]?.message).toContain("Customer information is incomplete");
    });

    it("should fail if no items are provided", async () => {
        const res = await request(app)
            .post("/api/sale")
            .set("Authorization", `Bearer ${token}`)
            .send({
                customerInformation: { firstName: "John", phone: "5551234" },
                items: [],
                policyTitle: "Policy",
                policyDescription: "Desc",
            });

        expect(res.status).toBe(400);
        expect(res.body.errors?.[0]?.message).toContain("No items provided for sale");
    });

    /* ------------------ GET ALL SALES ------------------ */
    it("should fetch all sales", async () => {
        const res = await request(app)
            .get("/api/sale")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    /* ------------------ GET SALE BY ID ------------------ */
    it("should fetch a single sale by ID", async () => {
        const res = await request(app)
            .get(`/api/sale/${saleId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(saleId);
        expect(res.body.invoiceNumber).toMatch(/^VCR-/);
    });

    it("should return 400 for non-existing sale", async () => {
        const fakeId = "652fa819f1f2a0d8b8f9e123";
        const res = await request(app)
            .get(`/api/sale/${fakeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors?.[0]?.message).toContain("not found");
    });

    /* ------------------ REFUND SALE ------------------ */
    it("should refund a sale successfully", async () => {
        const res = await request(app)
            .post(`/api/sale/${saleId}/refund`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Sale refunded successfully");
        expect(res.body.data.status).toBe("refunded");
    });

    it("should not refund an already refunded sale", async () => {
        const res = await request(app)
            .post(`/api/sale/${saleId}/refund`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body.errors?.[0]?.message).toContain("already refunded");
    });
});
