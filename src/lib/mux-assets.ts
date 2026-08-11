// Server-side Mux asset listing for the Work page.
//
// The Work cards used to be a hardcoded list in site-data.ts; they now come
// from the client's own Mux environment: every READY asset with a public
// playback ID becomes a card, newest first. Uploading a video in the Mux
// dashboard (with MP4 / static renditions enabled, so the plain <video>
// tags keep working) is all it takes to publish a new piece — no deploy.
//
// MUX_TOKEN_ID / MUX_TOKEN_SECRET are SERVER-ONLY secrets (.env.local /
// deploy env, never committed, never NEXT_PUBLIC). This module must only be
// imported from server components. Builds without the credentials (e.g. the
// GitHub Pages export) return null and the page falls back to the
// hardcoded pieces.
//
// Conventions the client controls from the Mux dashboard:
//   * Card title = the asset's meta.title (or passthrough) — falls back to
//     "Untitled NN".
//   * Register tag = "bold"/"glam" wherever either word appears in the
//     title (e.g. "Bold — High Wire"); untitled/unmarked assets alternate.

import type { WorkPiece } from "@/lib/site-data";

interface MuxAsset {
  id: string;
  status: string;
  created_at: string;
  passthrough?: string;
  meta?: { title?: string };
  playback_ids?: { id: string; policy: string }[];
  static_renditions?: {
    status?: string;
    files?: { name?: string; status?: string; ext?: string }[];
  };
}

/** The asset's best ready MP4 rendition filename, if any. */
function mp4File(asset: MuxAsset): string | undefined {
  const files = asset.static_renditions?.files ?? [];
  const ready = files.filter(
    (f) => f.name?.endsWith(".mp4") && (f.status === undefined || f.status === "ready"),
  );
  // Prefer the highest-quality rendition when several exist.
  const order = ["highest.mp4", "capped-1080p.mp4", "high.mp4", "medium.mp4", "low.mp4"];
  ready.sort((a, b) => {
    const ai = order.indexOf(a.name ?? "");
    const bi = order.indexOf(b.name ?? "");
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
  });
  return ready[0]?.name;
}

export async function listMuxWork(): Promise<WorkPiece[] | null> {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) return null;

  try {
    const res = await fetch("https://api.mux.com/video/v1/assets?limit=100", {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64"),
      },
      // Uploads show up within five minutes without a redeploy (ISR on
      // Vercel; a build-time snapshot on static export).
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error(`[mux] asset list failed (${res.status})`);
      return null;
    }
    const body = (await res.json()) as { data?: MuxAsset[] };
    const assets = Array.isArray(body.data) ? body.data : [];

    const pieces = assets
      .filter((a) => a.status === "ready")
      .map((a) => ({
        asset: a,
        playback: (a.playback_ids ?? []).find((p) => p.policy === "public"),
      }))
      .filter((x): x is { asset: MuxAsset; playback: { id: string; policy: string } } =>
        Boolean(x.playback),
      )
      .sort((a, b) => Number(b.asset.created_at) - Number(a.asset.created_at))
      .map(({ asset, playback }, i): WorkPiece => {
        const title =
          (asset.meta?.title || asset.passthrough || "").trim() ||
          `Untitled ${String(i + 1).padStart(2, "0")}`;
        const theme = /bold/i.test(title)
          ? "bold"
          : /glam/i.test(title)
            ? "glam"
            : i % 2 === 0
              ? "glam"
              : "bold";
        return {
          slug: asset.id,
          title,
          theme,
          location: "",
          year: new Date(Number(asset.created_at) * 1000).getFullYear(),
          credit: "",
          muxPlaybackId: playback.id,
          muxMp4File: mp4File(asset),
        };
      });

    return pieces.length > 0 ? pieces : null;
  } catch (err) {
    console.error("[mux] asset list failed:", err);
    return null;
  }
}
