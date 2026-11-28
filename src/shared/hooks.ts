import { useEffect } from 'react';
import confetti from 'canvas-confetti';

/** Fires two confetti bursts when mounted. */
export function useConfetti() {
  useEffect(() => {
    const colors = ['#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#ffffff'];
    const fire = (x: number, angle: number) =>
      confetti({
        particleCount: 70,
        angle,
        spread: 70,
        startVelocity: 55,
        origin: { x, y: 0.75 },
        colors,
        disableForReducedMotion: true,
      });
    fire(0, 60);
    fire(1, 120);
    const t = window.setTimeout(() => {
      fire(0.2, 75);
      fire(0.8, 105);
    }, 450);
    return () => {
      window.clearTimeout(t);
      confetti.reset();
    };
  }, []);
}

/** Warns before leaving the page (back swipe / reload) while `active`. */
export function useLeaveGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [active]);
}

/** Keeps the screen awake while `active`, where the browser supports it. */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    const request = () => {
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          if (cancelled) void l.release();
          else lock = l;
        })
        .catch(() => {});
    };
    request();
    const onVisible = () => {
      if (document.visibilityState === 'visible') request();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      void lock?.release();
    };
  }, [active]);
}
