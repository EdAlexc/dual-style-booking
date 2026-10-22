// Server-side listing of the Work page's image buckets (Neon Object
// Storage, S3-compatible).
//
// Images live in two public_read buckets, one per register — upload a
// photo to the "glam" bucket or the "bold" bucket and that alone decides
// the card's tag; there's no filename convention to get wrong. Reads are
// anonymous (no credential needed for the <img> tag's GET), but
// discovering *which* objects exist (so an upload shows up as a card with
// no deploy) is a signed S3 ListObjectsV2 call, which does need a
// credential regardless of the bucket's access level. Every object is its
// own card — nothing is deduped or merged across the two buckets.
//
// NEON_STORAGE_ACCESS_KEY_ID / NEON_STORAGE_SECRET_ACCESS_KEY are
// SERVER-ONLY secrets (.env.local / deploy env, never committed, never
// NEXT_PUBLIC). This module must only be imported from server components.
// Builds without the credentials (e.g. the GitHub Pages export) return null
// and the page falls back to the hardcoded pieces in site-data.ts.
//
// The filename (minus extension) becomes the card title, e.g.
// "high-wire.jpg" -> "High Wire".

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

type DatedPiece = WorkPiece & { lastModified: number };

async function listBucket(
  client: S3Client,
  bucket: string,
  endpoint: string,
  theme: "glam" | "bold",
): Promise<DatedPiece[]> {
  const res = await client.send(new ListObjectsV2Command({ Bucket: bucket }));
  const objects = (res.Contents ?? []).filter((o) => o.Key && !o.Key.endsWith("/"));
  return objects.map((obj): DatedPiece => {
    const key = obj.Key!;
    const lastModified = obj.LastModified ?? new Date(0);
    return {
      // Prefix with the bucket so a same-named file in both buckets still
      // gets two distinct cards.
      slug: `${theme}/${key}`,
      title: titleFromKey(key),
      theme,
      location: "",
      year: lastModified.getFullYear(),
      credit: "",
      imageUrl: `${endpoint}/${bucket}/${key}`,
      lastModified: lastModified.getTime(),
    };
  });
}

export async function listNeonWork(): Promise<WorkPiece[] | null> {
  const endpoint = process.env.NEON_STORAGE_ENDPOINT;
  const glamBucket = process.env.NEON_STORAGE_BUCKET_GLAM;
  const boldBucket = process.env.NEON_STORAGE_BUCKET_BOLD;
  const accessKeyId = process.env.NEON_STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEON_STORAGE_SECRET_ACCESS_KEY;
  if (!endpoint || !glamBucket || !boldBucket || !accessKeyId || !secretAccessKey) return null;

  try {
    const client = new S3Client({
      region: process.env.NEON_STORAGE_REGION ?? "us-east-2",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    const [glam, bold] = await Promise.all([
      listBucket(client, glamBucket, endpoint, "glam"),
      listBucket(client, boldBucket, endpoint, "bold"),
    ]);

    const pieces = [...glam, ...bold]
      .sort((a, b) => b.lastModified - a.lastModified)
      .map(({ lastModified, ...piece }): WorkPiece => piece);

    return pieces.length > 0 ? pieces : null;
  } catch (err) {
    console.error("[neon-storage] object list failed:", err);
    return null;
  }
}
