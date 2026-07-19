"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme, type Theme } from "@/lib/theme";
import { heroVideoSrc } from "@/lib/mux";
import glamPoster from "@/assets/glam-hero.jpg";
import boldPoster from "@/assets/bold-hero.jpg";

/**
 * Diagonal-split landing.
 * - Two panels clipped along the main diagonal (Glam top-left, Bold bottom-right).
 * - Each panel wraps a <video> that autoplays muted+looped.
 * - A solid black overlay covers each panel by default; hover/focus fades it to
 *   reveal the video and activates the corresponding site theme.
 * - Mobile: tap a panel to reveal.
 *
 * Footage streams from Mux: set NEXT_PUBLIC_MUX_PLAYBACK_ID_GLAM / _BOLD (see
 * src/lib/mux.ts). Without playback IDs it falls back to local MP4s at
 * /public/videos/{glam,bold}.mp4; if those are missing too, the poster image
 * (rendered inside the <video> tag) stays visible.
 */
export function HomeClient() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const [hovered, setHovered] = useState<Theme | null>(null);
  const [revealed, setRevealed] = useState<Set<Theme>>(new Set());
  const [explorePicker, setExplorePicker] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const glamVideo = useRef<HTMLVideoElement>(null);
  const boldVideo = useRef<HTMLVideoElement>(null);

  // Detect genuine touch devices (coarse pointer, no hover) so we can swap
  // hover-to-reveal for press-and-hold. A desktop/laptop window shrunk to
  // phone dimensions still reports a fine pointer with hover, so it keeps the
  // hover interaction — this only flips on real touchscreens.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Sync active theme with the currently focused/hovered panel.
  useEffect(() => {
    if (hovered) setTheme(hovered);
  }, [hovered, setTheme]);

  const activate = (t: Theme) => {
    setHovered(t);
    setRevealed((r) => new Set(r).add(t));
    const v = t === "glam" ? glamVideo.current : boldVideo.current;
    v?.play().catch(() => {});
  };

  const deactivate = () => setHovered(null);

  const openWork = (t: Theme) => {
    router.push(`/work?filter=${t}`);
  };

  const pickExplore = (t: Theme) => {
    setTheme(t);
    router.push(`/work?filter=${t}`);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <h1 className="sr-only">Emmanuel de Jesus MUA — Editorial and Bridal Makeup Artist in New York City</h1>
      {/* GLAM — top-left triangle */}
      <Panel
        theme="glam"
        isTouch={isTouch}
        active={hovered === "glam"}
        revealed={revealed.has("glam")}
        onActivate={() => activate("glam")}
        onNavigate={() => openWork("glam")}
        onDeactivate={deactivate}
        clip="polygon(0 0, 100% 0, 0 100%)"
        align="items-start justify-start"
        textAnchor="left-[6vw] top-[10vh]"
        label="Glam"
        subtitle="Ivory · Dewy · Editorial"
        videoRef={glamVideo}
        videoSrc={heroVideoSrc("glam")}
        poster={glamPoster.src}
      />

      {/* BOLD — bottom-right triangle */}
      <Panel
        theme="bold"
        isTouch={isTouch}
        active={hovered === "bold"}
        revealed={revealed.has("bold")}
        onActivate={() => activate("bold")}
        onNavigate={() => openWork("bold")}
        onDeactivate={deactivate}
        clip="polygon(100% 0, 100% 100%, 0 100%)"
        align="items-end justify-end"
        textAnchor="right-[6vw] bottom-[10vh] text-right"
        label="Bold"
        subtitle="Noir · Graphic · Editorial"
        videoRef={boldVideo}
        videoSrc={heroVideoSrc("bold")}
        poster={boldPoster.src}
      />

      {/* Diagonal hairline */}
      <div
        aria-hidden
        className="diagonal-hairline pointer-events-none absolute inset-0 z-30"
      />

      {/* Top brand + meta bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.25em] text-white/85 mix-blend-difference">
        <span className="font-display text-lg normal-case tracking-tight">
          Emmanuel de Jesus <span className="text-white">MUA</span>
        </span>
        <span className="hidden sm:inline">New York City · 2026</span>
        <Link
          href="/book"
          className="pointer-events-auto border border-white/60 px-4 py-2 hover:bg-white hover:text-black"
        >
          Book
        </Link>
      </div>

      {/* Hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-40 flex justify-center px-6 text-center text-[10px] uppercase tracking-[0.25em] text-white/60 mix-blend-difference sm:bottom-6 sm:px-0 sm:tracking-[0.4em]">
        {hovered
          ? `${hovered} · ${isTouch ? "release, or tap to open" : "click to explore relevant work"}`
          : isTouch
            ? "Press & hold a side to reveal · tap to open"
            : "Hover to a side to reveal"}
      </div>

      {/* Skip to explore */}
      <button
        type="button"
        onClick={() => setExplorePicker(true)}
        className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 border border-white/40 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:left-auto sm:right-6 sm:translate-x-0"
      >
        Explore work →
      </button>

      {/* Explore register picker */}
      {explorePicker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose a register to explore"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setExplorePicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-6 w-full max-w-2xl border border-white/20 bg-black p-8 text-white md:p-12"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/60">Explore work</p>
            <h2 className="mt-3 font-display text-4xl leading-[1] md:text-5xl">
              Glam or Bold?
            </h2>
            <p className="mt-4 text-sm text-white/70">
              Pick a register and we'll show you that side of the portfolio.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => pickExplore("glam")}
                className="group border border-white/30 p-6 text-left transition-colors hover:bg-white hover:text-black"
              >
                <p className="font-display text-3xl">Glam</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60 group-hover:text-black/60">
                  Ivory · Dewy · Editorial
                </p>
              </button>
              <button
                type="button"
                onClick={() => pickExplore("bold")}
                className="group border border-white/30 p-6 text-left transition-colors hover:bg-white hover:text-black"
              >
                <p className="font-display text-3xl uppercase tracking-wide">Bold</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60 group-hover:text-black/60">
                  Noir · Graphic · Editorial
                </p>
              </button>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setExplorePicker(false);
                  router.push("/work?filter=all");
                }}
                className="text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white"
              >
                See all →
              </button>
              <button
                type="button"
                onClick={() => setExplorePicker(false)}
                className="text-[10px] uppercase tracking-[0.3em] text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

type PanelProps = {
  theme: Theme;
  isTouch: boolean;
  active: boolean;
  revealed: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onNavigate: () => void;
  clip: string;
  align: string;
  textAnchor: string;
  label: string;
  subtitle: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoSrc: string;
  poster: string;
};

function Panel(p: PanelProps) {
  const press = useRef<{ t: number; x: number; y: number } | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Touch: press-and-hold reveals the panel; a quick tap opens its work page.
  const touchHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      press.current = { t: Date.now(), x: e.clientX, y: e.clientY };
      p.onActivate();
    },
    onPointerUp: (e: React.PointerEvent) => {
      const start = press.current;
      press.current = null;
      p.onDeactivate();
      const quickTap =
        !!start &&
        Date.now() - start.t < 350 &&
        Math.hypot(e.clientX - start.x, e.clientY - start.y) < 12;
      if (quickTap) p.onNavigate();
    },
    onPointerLeave: () => {
      press.current = null;
      p.onDeactivate();
    },
    onPointerCancel: () => {
      press.current = null;
      p.onDeactivate();
    },
    // Suppress the long-press context menu / image callout on mobile.
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };

  // Pointer devices: hover reveals; click opens the work page.
  const hoverHandlers = {
    onMouseEnter: p.onActivate,
    onMouseLeave: p.onDeactivate,
    onFocus: p.onActivate,
    onBlur: p.onDeactivate,
    onClick: () => {
      p.onActivate();
      p.onNavigate();
    },
  };

  return (
    <button
      type="button"
      {...(p.isTouch ? touchHandlers : hoverHandlers)}
      aria-label={`View ${p.label} work — makeup in the ${p.label.toLowerCase()} register`}
      className={`group absolute inset-0 z-10 flex ${p.align} cursor-pointer overflow-hidden text-left focus:outline-none ${
        p.isTouch ? "select-none [touch-action:none] [-webkit-touch-callout:none]" : ""
      }`}
      style={{ clipPath: p.clip }}
    >
      {/* Poster image — always rendered as the base reveal layer so a photo
          shows on every device even when the hero video is unavailable (no Mux
          ID configured / offline). Relying on the <video> poster alone fails on
          mobile browsers, which clear the poster and paint a blank frame once
          .play() is called on a video whose source can't load. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center ken-burns"
        style={{ backgroundImage: `url(${p.poster})` }}
      />

      {/* Video layer — fades in over the poster only once it can actually
          play, so a broken/missing source never hides the photo. */}
      <video
        ref={p.videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster={p.poster}
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => setVideoReady(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover ken-burns transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={p.videoSrc} type="video/mp4" />
      </video>

      {/* Black reveal overlay */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-[900ms] ease-out ${
          p.active ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Subtle vignette when revealed */}
      <div
        aria-hidden
        className={`panel-vignette pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          p.active ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Label */}
      <div
        className={`relative z-20 max-w-[62vw] px-6 py-10 sm:max-w-[42vw] sm:px-8 sm:py-12 ${p.textAnchor} absolute transition-all duration-700 ${
          p.active ? "opacity-100 translate-y-0" : "opacity-70 translate-y-1"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/70">
          {p.active ? "Now viewing" : p.isTouch ? "Press & hold" : "Hover to reveal"}
        </p>
        <p
          className={`mt-3 text-[clamp(3.5rem,10vw,9rem)] leading-none text-white ${
            p.theme === "glam" ? "panel-label-glam" : "panel-label-bold"
          }`}
        >
          {p.label}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/70">
          {p.subtitle}
        </p>
      </div>
    </button>
  );
}
