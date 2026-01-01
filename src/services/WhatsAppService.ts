import configService from "./config-service";

export class WhatsAppService {
  private apiToken: string;
  private phoneId: string = "";
  private baseUrl = "https://graph.facebook.com/v24.0";

  constructor() {
    //console.log("WhatsAppService constructor");
    this.apiToken = process.env.META_API_TOKEN || "";
    if (!this.apiToken) {
      console.error("META_API_TOKEN not set");
    }
  }

  async typingIndicator(waMessageId: string): Promise<any> {
    const payload: any = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: waMessageId,
      typing_indicator: {
        type: "text"
      }
    };

    const response = await this.sendMessage(payload);
    return response;
  }

  async sendMessage(payload: any): Promise<any> {

    this.phoneId = await configService.getWhatappBusinessNumberId() ?? "";
    if (!this.phoneId || this.phoneId === "") {
      throw new Error("WhatsApp Business Number ID not found");
    }

    // const apiToken = await configService.getMetaApiToken();
    // if (!apiToken) {
    //   throw new Error("Meta API Token not found");
    // }

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


const whatsappService = new WhatsAppService();
export default whatsappService;
