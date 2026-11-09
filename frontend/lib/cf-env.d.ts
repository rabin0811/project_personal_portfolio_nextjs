declare global {
  interface CloudflareEnv {
    DB: D1Database;
    IMAGE_BUCKET: R2Bucket;
  }
}

export {};
