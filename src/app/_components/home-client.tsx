"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme, type Theme } from "@/lib/theme";
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
 * To use custom footage, drop MP4s at /public/videos/glam.mp4 and /public/videos/bold.mp4.
 * If missing, the poster image (rendered inside the <video> tag) stays visible.
 */
export function HomeClient() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const [hovered, setHovered] = useState<Theme | null>(null);
  const [revealed, setRevealed] = useState<Set<Theme>>(new Set());
  const [explorePicker, setExplorePicker] = useState(false);
  const glamVideo = useRef<HTMLVideoElement>(null);
  const boldVideo = useRef<HTMLVideoElement>(null);

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
      <h1 className="sr-only">Studio MUA — Editorial and Bridal Makeup Artist in New York City</h1>
      {/* GLAM — top-left triangle */}
      <Panel
        theme="glam"
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
        videoSrc="/videos/glam.mp4"
        poster={glamPoster.src}
      />

      {/* BOLD — bottom-right triangle */}
      <Panel
        theme="bold"
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
        videoSrc="/videos/bold.mp4"
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
          Studio <span className="text-white">MUA</span>
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
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-40 flex justify-center text-[10px] uppercase tracking-[0.4em] text-white/60 mix-blend-difference">
        {hovered
          ? `${hovered} · hover the other side to switch`
          : "Hover a side to reveal · tap on mobile"}
      </div>

      {/* Skip to explore */}
      <button
        type="button"
        onClick={() => setExplorePicker(true)}
        className="absolute bottom-6 right-6 z-40 border border-white/40 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
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
  return (
    <button
      type="button"
      onMouseEnter={p.onActivate}
      onMouseLeave={p.onDeactivate}
      onFocus={p.onActivate}
      onBlur={p.onDeactivate}
      onClick={() => { p.onActivate(); p.onNavigate(); }}
      aria-label={`View ${p.label} work — makeup in the ${p.label.toLowerCase()} register`}
      className={`group absolute inset-0 z-10 flex ${p.align} cursor-pointer overflow-hidden text-left focus:outline-none`}
      style={{ clipPath: p.clip }}
    >
      {/* Video / poster layer */}
      <video
        ref={p.videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        poster={p.poster}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover ken-burns"
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
        className={`relative z-20 max-w-[42vw] px-8 py-12 ${p.textAnchor} absolute transition-all duration-700 ${
          p.active ? "opacity-100 translate-y-0" : "opacity-70 translate-y-1"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/70">
          {p.active ? "Now viewing" : p.revealed ? "Revealed" : "Hover to reveal"}
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
