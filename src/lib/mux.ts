// Mux video delivery.
//
// Videos are referenced by their Mux *playback ID* (public, not a secret) and
// served as MP4s so the plain <video> tags keep working in every browser.
// MP4 delivery requires "static renditions" (an MP4 support option) to be
// enabled on the Mux asset.
//
// Landing-page hero playback IDs come from env (see .env / .env.example);
// per-piece Work videos are set on WORK items in src/lib/site-data.ts.

export function muxMp4Url(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}/capped-1080p.mp4`;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Source for a landing-page hero video: the Mux stream when a playback ID is
 * configured, otherwise the legacy local file under public/videos/ (the
 * poster image shows if that's missing too).
 */
export function heroVideoSrc(register: "glam" | "bold"): string {
  const playbackId =
    register === "glam"
      ? process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID_GLAM
      : process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID_BOLD;
  return playbackId ? muxMp4Url(playbackId) : `${BASE_PATH}/videos/${register}.mp4`;
}
