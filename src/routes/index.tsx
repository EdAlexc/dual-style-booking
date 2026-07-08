import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTheme, type Theme } from "@/lib/theme";
import glamPoster from "@/assets/glam-hero.jpg";
import boldPoster from "@/assets/bold-hero.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

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
function Landing() {
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<Theme | null>(null);
  const [revealed, setRevealed] = useState<Set<Theme>>(new Set());
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
    navigate({ to: "/work", search: { filter: t } });
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
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
        poster={glamPoster}
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
        poster={boldPoster}
      />

      {/* Diagonal hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background:
            "linear-gradient(to top right, transparent calc(50% - 0.5px), rgba(255,255,255,0.35) 50%, transparent calc(50% + 0.5px))",
        }}
      />

      {/* Top brand + meta bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.25em] text-white/85 mix-blend-difference">
        <span className="font-display text-lg normal-case tracking-tight">
          Studio <span className="text-white">MUA</span>
        </span>
        <span className="hidden sm:inline">New York City · 2026</span>
        <Link
          to="/book"
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
      <Link
        to="/work"
        className="absolute bottom-6 right-6 z-40 border border-white/40 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
      >
        Explore work →
      </Link>
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
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          p.active ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
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
          className="mt-3 text-[clamp(3.5rem,10vw,9rem)] leading-none text-white"
          style={{
            fontFamily:
              p.theme === "glam"
                ? '"Playfair Display", ui-serif, Georgia, serif'
                : '"Archivo", "Inter", ui-sans-serif, system-ui, sans-serif',
            letterSpacing: p.theme === "bold" ? "0.02em" : "-0.01em",
            textTransform: p.theme === "bold" ? "uppercase" : "none",
            fontWeight: p.theme === "bold" ? 700 : 400,
          }}
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
