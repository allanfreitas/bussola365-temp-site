export class WhatsAppService {
  private apiToken: string;
  private phoneId: string;
  private baseUrl = "https://graph.facebook.com/v24.0";

  constructor() {
    this.apiToken = process.env.WHATSAPP_API_TOKEN || "";
    this.phoneId = process.env.WHATSAPP_PHONE_ID || "";
    if (!this.apiToken || !this.phoneId) {
      console.error("WHATSAPP_API_TOKEN or WHATSAPP_PHONE_ID not set");
    }
  }

  async sendMessage(payload: any): Promise<any> {
    const url = `${this.baseUrl}/${this.phoneId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: typeof payload === "string" ? payload : JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WhatsApp API Error: ${error}`);
    }

    return await response.json();
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    const url = `${this.baseUrl}/${mediaId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.apiToken}` },
    });

    if (!response.ok) throw new Error("Failed to get media URL");

    const data = (await response.json()) as any;
    return data.url;
  }

  async downloadMedia(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${this.apiToken}` },
    });

    if (!response.ok) throw new Error("Failed to download media");
    return await response.arrayBuffer();
  }
}
