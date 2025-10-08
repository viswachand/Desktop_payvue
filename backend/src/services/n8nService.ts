import axios from "axios";

const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/sale-notification";

export const notifyN8n = async (event: string, payload: any) => {
    if (!N8N_WEBHOOK_URL) {
        console.warn("[n8n] Webhook URL not configured, skipping notification");
        return;
    }

    try {
        await axios.post(N8N_WEBHOOK_URL, {
            event,
            timestamp: new Date().toISOString(),
            data: payload,
        });

        console.log(`[n8n] Event sent successfully: ${event}`);
    } catch (err) {
        console.error("[n8n] Failed to send event:", (err as Error).message);
    }
};
