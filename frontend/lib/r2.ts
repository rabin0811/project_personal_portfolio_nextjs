import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fileSafeName } from "@/lib/slug";

export async function putImage(
  data: Uint8Array,
  contentType: string,
  folder: string,
  fileName: string,
): Promise<string> {
  const { env } = await getCloudflareContext({ async: true });
  const key = `${folder}/${Date.now()}-${fileSafeName(fileName)}`;
  await env.IMAGE_BUCKET.put(key, data, {
    httpMetadata: { contentType },
  });
  return key;
}

export async function deleteImage(key: string): Promise<void> {
  const { env } = await getCloudflareContext({ async: true });
  await env.IMAGE_BUCKET.delete(key);
}
