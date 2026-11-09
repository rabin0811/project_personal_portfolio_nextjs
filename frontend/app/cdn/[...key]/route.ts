import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const keyPath = key.join("/");
  const { env } = await getCloudflareContext({ async: true });

  const object = await env.IMAGE_BUCKET.get(keyPath);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(object.body, { headers });
}
