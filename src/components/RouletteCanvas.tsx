import React, { useRef, useEffect, useState, useCallback } from 'react';
import { EUROPEAN_WHEEL_SEQUENCE, RED_NUMBERS } from '../utils/constants';
import { audioEngine } from '../utils/audio';

interface RouletteCanvasProps {
  eliminatedNumbers: Set<number>;
  isSpinning: boolean;
  onSpinStart?: () => void;
  onSpinEnd: (winningNumber: number) => void;
  targetNumber?: number | null;
  disabled?: boolean;
}

export const RouletteCanvas: React.FC<RouletteCanvasProps> = ({
  eliminatedNumbers,
  isSpinning,
  onSpinStart,
  onSpinEnd,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Wheel animation physics state stored in refs for 60fps loop
  const animationRef = useRef<number | null>(null);
  const wheelAngleRef = useRef<number>(0);
  const wheelSpeedRef = useRef<number>(0);
  const lastSpokeRef = useRef<number>(-1);

  // Particle explosion on win
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number; size: number }>>([]);

  const [spinResultNumber, setSpinResultNumber] = useState<number | null>(null);

  const numSlices = EUROPEAN_WHEEL_SEQUENCE.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Helper function to calculate which number is directly under the 12 o'clock pointer
  const getNumberAtPointer = useCallback((wheelAngle: number): number => {
    const pointerAngle = -Math.PI / 2; // 12 o'clock
    const wheelRelativeAngle = (pointerAngle - wheelAngle) % (2 * Math.PI);
    const positiveAngle = (wheelRelativeAngle + 2 * Math.PI) % (2 * Math.PI);
    const landedIndex = Math.floor(positiveAngle / sliceAngle) % numSlices;
    return EUROPEAN_WHEEL_SEQUENCE[landedIndex];
  }, [sliceAngle, numSlices]);

  // Draw the entire wheel & pointer
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 12;
    const trackRadius = outerRadius * 0.88;
    const wheelRadius = outerRadius * 0.78;
    const innerRadius = outerRadius * 0.35;
    const centerHubRadius = outerRadius * 0.20;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Outer Mahogany / Gold Decorative Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    const rimGrad = ctx.createRadialGradient(centerX, centerY, wheelRadius, centerX, centerY, outerRadius);
    rimGrad.addColorStop(0, '#1c1308');
    rimGrad.addColorStop(0.5, '#452b14');
    rimGrad.addColorStop(0.85, '#855124');
    rimGrad.addColorStop(1, '#2b1a0c');
    ctx.fillStyle = rimGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    // Draw Gold Rivets around rim
    for (let i = 0; i < 24; i++) {
      const angle = (i * 2 * Math.PI) / 24;
      const rx = centerX + (outerRadius - 6) * Math.cos(angle);
      const ry = centerY + (outerRadius - 6) * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(rx, ry, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#fef08a';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Draw Outer Track Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, trackRadius, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY, wheelRadius, 0, 2 * Math.PI, true);
    const trackGrad = ctx.createRadialGradient(centerX, centerY, wheelRadius, centerX, centerY, trackRadius);
    trackGrad.addColorStop(0, '#0f172a');
    trackGrad.addColorStop(0.5, '#1e293b');
    trackGrad.addColorStop(1, '#020617');
    ctx.fillStyle = trackGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Determine current number under pointer
    const currentHoverNumber = getNumberAtPointer(wheelAngleRef.current);

    // 3. Draw Rotating Wheel Slices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(wheelAngleRef.current);

    EUROPEAN_WHEEL_SEQUENCE.forEach((num, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const isEliminated = eliminatedNumbers.has(num);
      const isWinner = spinResultNumber === num || (!isSpinning && currentHoverNumber === num);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
      ctx.closePath();

      // Pocket colors
      if (isEliminated) {
        ctx.fillStyle = '#1e1e24'; // Dimmed grey-dark for eliminated numbers
      } else if (isWinner) {
        ctx.fillStyle = '#fbbf24'; // Bright winner gold
      } else if (num === 0) {
        ctx.fillStyle = '#059669'; // Emerald green
      } else if (RED_NUMBERS.has(num)) {
        ctx.fillStyle = '#dc2626'; // Casino red
      } else {
        ctx.fillStyle = '#111827'; // Dark black
      }
      ctx.fill();

      // Slice separator spokes
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isWinner ? '#ffffff' : 'rgba(255, 255, 255, 0.25)';
      ctx.stroke();

      // If eliminated, draw an overlay diagonal cross
      if (isEliminated) {
        ctx.save();
        ctx.beginPath();
        const midAngle = startAngle + sliceAngle / 2;
        const textR = wheelRadius * 0.72;
        const tx = Math.cos(midAngle) * textR;
        const ty = Math.sin(midAngle) * textR;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 2;
        ctx.moveTo(tx - 6, ty - 6);
        ctx.lineTo(tx + 6, ty + 6);
        ctx.moveTo(tx + 6, ty - 6);
        ctx.lineTo(tx - 6, ty + 6);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Number Text
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.max(12, Math.floor(wheelRadius * 0.085))}px sans-serif`;

      if (isWinner) {
        ctx.fillStyle = '#000000';
      } else if (isEliminated) {
        ctx.fillStyle = '#6b7280';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillText(num.toString(), wheelRadius * 0.82, 0);
      ctx.restore();
    });

    // 4. Draw Inner Gold Ring & Center Spoke Hub
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center Brass Hub
    ctx.beginPath();
    ctx.arc(0, 0, centerHubRadius, 0, 2 * Math.PI);
    const brassGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerHubRadius);
    brassGrad.addColorStop(0, '#fef08a');
    brassGrad.addColorStop(0.6, '#f59e0b');
    brassGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = brassGrad;
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // 5. Draw Prominent Glowing Yellow Pointer Arrow at 12 o'clock
    ctx.save();
    const pointerY = centerY - wheelRadius;

    // Glowing outer aura around pointer
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 16;

    ctx.beginPath();
    ctx.moveTo(centerX, pointerY + 16); // Sharp tip pointing down into slice
    ctx.lineTo(centerX - 14, pointerY - 14);
    ctx.lineTo(centerX + 14, pointerY - 14);
    ctx.closePath();

    const pointerGrad = ctx.createLinearGradient(centerX, pointerY - 14, centerX, pointerY + 16);
    pointerGrad.addColorStop(0, '#fef08a');
    pointerGrad.addColorStop(0.5, '#f59e0b');
    pointerGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = pointerGrad;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    // 6. Draw Win Particle Sparks
    if (particlesRef.current.length > 0) {
      ctx.save();
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
          particlesRef.current.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
      });
      ctx.restore();
    }
  }, [eliminatedNumbers, spinResultNumber, sliceAngle, getNumberAtPointer]);

  // Main 60fps render loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isSpinning) {
      // Rotate wheel with physics deceleration
      wheelAngleRef.current += wheelSpeedRef.current;
      wheelSpeedRef.current *= 0.986; // Friction decay

      // Audio click on slice boundary crossing
      const currentNumber = getNumberAtPointer(wheelAngleRef.current);
      if (currentNumber !== lastSpokeRef.current) {
        lastSpokeRef.current = currentNumber;
        audioEngine.playTick(Math.min(1.0, wheelSpeedRef.current * 8));
      }

      // Check if wheel stopped
      if (wheelSpeedRef.current < 0.0015) {
        wheelSpeedRef.current = 0;
        const landedNumber = getNumberAtPointer(wheelAngleRef.current);

        setSpinResultNumber(landedNumber);
        audioEngine.playBallBounce();
        audioEngine.playWinFanfare(landedNumber === 0);

        // Spawn win particle burst at pointer position (12 o'clock)
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 - (canvas.height / 2 - 12) * 0.78;
        for (let i = 0; i < 40; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 1.5;
          particlesRef.current.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: landedNumber === 0 ? '#10b981' : RED_NUMBERS.has(landedNumber) ? '#ef4444' : '#f59e0b',
            life: 1.0,
            size: Math.random() * 4 + 3,
          });
        }

        onSpinEnd(landedNumber);
        return; // Stop animation loop
      }
    }

    draw(ctx, canvas.width, canvas.height);
    animationRef.current = requestAnimationFrame(animate);
  }, [isSpinning, getNumberAtPointer, draw, onSpinEnd]);

  // Handle spin trigger initialization
  useEffect(() => {
    if (isSpinning) {
      setSpinResultNumber(null);
      // Randomize initial rotational speed for variable outcome
      wheelSpeedRef.current = 0.28 + Math.random() * 0.18;
      if (onSpinStart) onSpinStart();
    }
  }, [isSpinning, onSpinStart]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Outer Glow Container */}
      <div className="relative rounded-full p-2 bg-gradient-to-b from-amber-500/20 via-red-500/10 to-emerald-500/20 shadow-2xl backdrop-blur-xl border border-amber-500/30">
        <canvas
          ref={canvasRef}
          width={460}
          height={460}
          className="rounded-full max-w-full h-auto cursor-pointer"
        />

        {/* Center Spin Action Button Overlay */}
        {!isSpinning && (
          <button
            onClick={() => !disabled && onSpinStart?.()}
            disabled={disabled}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold text-white shadow-2xl border-4 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              disabled
                ? 'bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 border-yellow-200 neon-glow-gold hover:brightness-110 cursor-pointer'
            }`}
          >
            <span className="text-sm tracking-wider uppercase drop-shadow text-slate-950 font-extrabold">SPIN</span>
            <span className="text-[10px] text-amber-950 font-semibold">WHEEL</span>
          </button>
        )}
      </div>
    </div>
  );
};
