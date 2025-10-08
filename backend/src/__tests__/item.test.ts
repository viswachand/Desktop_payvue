import request from "supertest";
import { app } from "../app";
import { getAuthToken } from "../_helpers_/authHelper";

describe("Item API", () => {
    let token: string;
    let itemId: string;

    beforeAll(async () => {
        token = await getAuthToken();
    });

    it("should create an item", async () => {
        const res = await request(app)
            .post("/api/items")
            .set("Authorization", `Bearer ${token}`)
            .send({
                itemSKU: "SKU123",
                itemName: "Diamond Ring",
                itemDescription: "18K Gold Diamond Ring",
                itemCategory: "68de8ad92419602685ec48f4",
                costPrice: 500,
                unitPrice: 1200,
                quantity: 10,
                vendor: "Tiffany & Co",
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.itemSKU).toBe("SKU123");
        itemId = res.body.data.id;
    });

    it("should fetch all items", async () => {
        const res = await request(app)
            .get("/api/items")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should fetch a single item by ID", async () => {
        const res = await request(app)
            .get(`/api/items/${itemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe(itemId);
    });

    it("should update an item", async () => {
        const res = await request(app)
            .put(`/api/items/${itemId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                itemName: "Platinum Ring",
                quantity: 15,
            });

        expect(res.status).toBe(200);
        expect(res.body.data.itemName).toBe("Platinum Ring");
        expect(res.body.data.quantity).toBe(15);
    });

    it("should delete an item", async () => {
        const res = await request(app)
            .delete(`/api/items/${itemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Item deleted successfully");
    });

    it("should return error for deleted item", async () => {
        const res = await request(app)
            .get(`/api/items/${itemId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400); // BadRequestError
        expect(res.body.success).toBe(false);
    });
});
