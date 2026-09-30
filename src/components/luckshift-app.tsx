import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX, Vibrate, VibrateOff } from "lucide-react";
import { FACES, createLuckshift, type Hud, type LuckshiftApi } from "@/game/engine";

const INITIAL: Hud = {
  phase: "title",
  score: 0,
  best: 0,
  combo: 0,
  face: 1,
  faceName: "Swift",
  faceBlurb: "Quicker hands",
  faceT: 1,
  rolling: false,
  ward: false,
  gems: 0,
  nears: 0,
  seconds: 0,
  sound: true,
  shake: true,
  newBest: false,
};

const TONE = [
  "bg-primary",
  "bg-fg",
  "bg-accent",
  "bg-accent",
  "bg-danger",
  "bg-primary",
] as const;

export function LuckshiftApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<LuckshiftApi | null>(null);
  const [hud, setHud] = useState<Hud>(INITIAL);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const api = createLuckshift(canvas, setHud);
    apiRef.current = api;
    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, []);

  const playing = hud.phase === "play";
  const showRunHud = hud.phase === "play" || hud.phase === "pause";

  return (
    <main className="flex h-dvh w-full overflow-hidden bg-bg text-fg">
      <div className="mx-auto flex h-full w-full max-w-6xl">
        <aside className="hidden w-80 shrink-0 flex-col justify-between border-r border-line px-8 py-8 lg:flex">
          <div>
            <p className="text-xs font-medium tracking-widest text-primary uppercase">
              Arcade
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none font-medium text-fg">
              Luckshift
            </h1>
            <p className="mt-4 max-w-xs text-sm text-muted">
              A die rewrites the shaft every few seconds. Drift through the coral, pocket the
              teal, and don’t kiss the gates.
            </p>
            <ol className="mt-8 space-y-3">
              {FACES.map((face, i) => {
                const on = hud.face === face.id && hud.phase !== "dead";
                return (
                  <li
                    key={face.id}
                    className={
                      "flex items-center gap-3 rounded-card border px-3 py-2 " +
                      (on ? "border-primary bg-surface" : "border-line")
                    }
                  >
                    <span className={`size-2.5 shrink-0 rounded-full ${TONE[i]}`} />
                    <span className="w-16 text-sm font-medium">{face.name}</span>
                    <span className="text-sm text-muted">{face.blurb}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="text-sm text-muted">
            Drag to drift. <span className="text-fg">A</span> left, <span className="text-fg">D</span>{" "}
            right. <span className="text-fg">P</span> pauses.
            {hud.best > 0 ? ` Best ${hud.best.toLocaleString("en-US")}.` : ""}
          </p>
        </aside>

        <div className="relative min-w-0 flex-1">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none select-none"
            aria-label="Luckshift playfield"
          />

          {showRunHud && (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-4xl leading-none font-medium tabular-nums">
                    {hud.score.toLocaleString("en-US")}
                  </p>
                  <p className="mt-1 text-xs text-muted tabular-nums">
                    Best {hud.best.toLocaleString("en-US")}
                    {hud.combo >= 2 ? (
                      <span className="ml-2 text-accent">×{hud.combo} combo</span>
                    ) : null}
                  </p>
                </div>
                <div className="pointer-events-auto flex gap-2">
                  <IconButton
                    label={hud.sound ? "Mute sound" : "Unmute sound"}
                    onClick={() => apiRef.current?.toggleSound()}
                  >
                    {hud.sound ? <Volume2 /> : <VolumeX />}
                  </IconButton>
                  <IconButton
                    label={playing ? "Pause" : "Resume"}
                    onClick={() => apiRef.current?.togglePause()}
                  >
                    {playing ? <Pause /> : <Play />}
                  </IconButton>
                </div>
              </div>

              {playing && (
                <div className="mx-auto mt-3 w-full max-w-xs rounded-card border border-line bg-surface px-3 py-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-display text-lg leading-none font-medium">{hud.faceName}</p>
                    <p className="text-xs text-muted">{hud.ward ? "Ward up" : hud.faceBlurb}</p>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full ${hud.rolling ? "bg-muted" : "bg-primary"}`}
                      style={{ width: `${Math.round(hud.faceT * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="sr-only" aria-live="polite">
            {hud.phase === "play" ? `${hud.faceName}. ${hud.faceBlurb}` : hud.phase}
          </p>

          {hud.phase === "title" && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
              <div className="pointer-events-auto mx-auto max-h-full w-full max-w-md overflow-y-auto rounded-card border border-line bg-surface p-5">
                <p className="text-xs font-medium tracking-widest text-primary uppercase">
                  A random rule. A narrow shaft.
                </p>
                <h1 className="mt-2 font-display text-5xl leading-none font-medium lg:hidden">
                  Luckshift
                </h1>
                <p className="mt-3 text-sm text-muted lg:mt-0">
                  Drift the die. Coral bars end the run, round chips break if the face is Heavy,
                  teal gems feed the combo.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
                  {FACES.map((face, i) => (
                    <div
                      key={face.id}
                      className={
                        "rounded-card border px-2 py-2 text-center " +
                        (hud.face === face.id ? "border-primary" : "border-line")
                      }
                    >
                      <span className={`mx-auto mb-1 block size-2 rounded-full ${TONE[i]}`} />
                      <span className="text-xs font-medium">{face.name}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-card bg-primary text-base font-medium text-bg active:scale-95"
                  onClick={() => apiRef.current?.start()}
                >
                  Drop in
                </button>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
                  <span>Drag, A / D, or a stick</span>
                  {hud.best > 0 ? (
                    <span className="tabular-nums text-fg">
                      Best {hud.best.toLocaleString("en-US")}
                    </span>
                  ) : (
                    <span>P pauses</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {hud.phase === "pause" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg/70 p-4">
              <div className="w-full max-w-sm rounded-card border border-line bg-surface p-5 text-center">
                <h2 className="font-display text-4xl leading-none font-medium">Paused</h2>
                <p className="mt-2 text-sm text-muted">The shaft is holding its breath.</p>
                <button
                  type="button"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-card bg-primary font-medium text-bg"
                  onClick={() => apiRef.current?.togglePause()}
                >
                  <Play className="size-4" />
                  Resume
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-card border border-line text-sm"
                    onClick={() => apiRef.current?.toggleSound()}
                  >
                    {hud.sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                    {hud.sound ? "Sound on" : "Sound off"}
                  </button>
                  <button
                    type="button"
                    className="flex h-11 items-center justify-center gap-2 rounded-card border border-line text-sm"
                    onClick={() => apiRef.current?.toggleShake()}
                  >
                    {hud.shake ? <Vibrate className="size-4" /> : <VibrateOff className="size-4" />}
                    {hud.shake ? "Shake on" : "Shake off"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {hud.phase === "dead" && (
            <div className="absolute inset-0 z-20 flex items-end justify-center p-4 sm:items-center">
              <div className="w-full max-w-sm rounded-card border border-line bg-surface p-5">
                <p className="text-xs font-medium tracking-widest text-danger uppercase">
                  Shaft closed
                </p>
                <h2 className="mt-2 font-display text-5xl leading-none font-medium tabular-nums">
                  {hud.score.toLocaleString("en-US")}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {hud.newBest ? "New best." : `Best ${hud.best.toLocaleString("en-US")}`}
                </p>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat label="Time" value={`${hud.seconds}s`} />
                  <Stat label="Gems" value={String(hud.gems)} />
                  <Stat label="Close" value={String(hud.nears)} />
                </dl>
                <button
                  type="button"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-card bg-primary font-medium text-bg"
                  onClick={() => apiRef.current?.start()}
                >
                  <RotateCcw className="size-4" />
                  Roll again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-surface-2 px-2 py-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-display text-lg leading-tight tabular-nums">{value}</dd>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-card border border-line bg-surface text-fg [&_svg]:size-4"
    >
      {children}
    </button>
  );
}
