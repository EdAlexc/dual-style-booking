// Server-side listing of the Work page's image bucket (Neon Object
// Storage, S3-compatible).
//
// Images live in a public_read bucket, so once we know an object's key the
// <img> tag can just point at its public URL — no credential needed for
// that GET. Discovering *which* objects exist (so uploading a new photo
// shows up as a card with no deploy) is a signed S3 ListObjectsV2 call,
// which does need a credential regardless of the bucket's access level.
//
// NEON_STORAGE_ACCESS_KEY_ID / NEON_STORAGE_SECRET_ACCESS_KEY are
// SERVER-ONLY secrets (.env.local / deploy env, never committed, never
// NEXT_PUBLIC). This module must only be imported from server components.
// Builds without the credentials (e.g. the GitHub Pages export) return null
// and the page falls back to the hardcoded pieces in site-data.ts.
//
// Convention the client controls by where they drop the file in the
// bucket: a key under "bold/" or "glam/" sets the register tag (object key
// is otherwise free-form); pieces outside either folder alternate. The
// filename (minus extension) becomes the card title, e.g.
// "bold/high-wire.jpg" -> "High Wire" / bold.

import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import type { WorkPiece } from "@/lib/site-data";

function titleFromKey(key: string): string {
  const base = key.split("/").pop() ?? key;
  const stem = base.replace(/\.[^./]+$/, "");
  return stem
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function listNeonWork(): Promise<WorkPiece[] | null> {
  const endpoint = process.env.NEON_STORAGE_ENDPOINT;
  const bucket = process.env.NEON_STORAGE_BUCKET;
  const accessKeyId = process.env.NEON_STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEON_STORAGE_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) return null;

  try {
    const client = new S3Client({
      region: process.env.NEON_STORAGE_REGION ?? "us-east-2",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
    const res = await client.send(new ListObjectsV2Command({ Bucket: bucket }));
    const objects = (res.Contents ?? []).filter((o) => o.Key && !o.Key.endsWith("/"));

    const pieces = objects
      .sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0))
      .map((obj, i): WorkPiece => {
        const key = obj.Key!;
        const theme =
          key.startsWith("bold/") ? "bold" : key.startsWith("glam/") ? "glam" : i % 2 === 0 ? "glam" : "bold";
        return {
          slug: key,
          title: titleFromKey(key),
          theme,
          location: "",
          year: (obj.LastModified ?? new Date()).getFullYear(),
          credit: "",
          imageUrl: `${endpoint}/${bucket}/${key}`,
        };
      });

    return pieces.length > 0 ? pieces : null;
  } catch (err) {
    console.error("[neon-storage] object list failed:", err);
    return null;
  }
}
