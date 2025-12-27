export class StorageService {
  private s3Client: any; // Bun.S3Client type is global in Bun runtime
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME || "";
    if (!this.bucketName) {
      console.warn("AWS_BUCKET_NAME is not set");
    }

    // Bun.S3Client is available globally in Bun
    // @ts-ignore
    this.s3Client = new Bun.S3Client({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      bucket: this.bucketName,
    });
  }

  async uploadFile(
    key: string,
    file: Buffer | Uint8Array | string | Blob,
    contentType?: string
  ): Promise<void> {
    // Bun S3 write
    const fullFile = this.s3Client.file(key);
    await fullFile.write(file);
  }

  async getFile(key: string): Promise<ReadableStream | Blob | undefined> {
    const file = this.s3Client.file(key);
    if (await file.exists()) {
      return file; // Bun.S3File implements Blob interface partially or can be read
    }
    return undefined;
  }
}
