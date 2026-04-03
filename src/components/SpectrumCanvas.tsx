import { useEffect, useMemo, useRef } from 'react';
import { getSpectrumProfile } from '../../lib/spectrum.ts';

interface SpectrumCanvasProps {
  spectralType: string;
  starId: string;
}

function seedFromText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function randomFromSeed(seed: number) {
  let current = seed;
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296;
    return current / 4294967296;
  };
}

export function SpectrumCanvas({ spectralType, starId }: SpectrumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const profile = useMemo(() => getSpectrumProfile(spectralType), [spectralType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const random = randomFromSeed(seedFromText(`${starId}-${spectralType}`));
    const bandY = height * 0.32;
    const bandHeight = height * 0.36;

    context.clearRect(0, 0, width, height);

    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, '#020617');
    background.addColorStop(1, '#060915');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    const halo = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.45);
    halo.addColorStop(0, `${profile.secondaryColor}40`);
    halo.addColorStop(0.5, `${profile.baseColor}22`);
    halo.addColorStop(1, 'rgba(2,6,23,0)');
    context.fillStyle = halo;
    context.fillRect(0, 0, width, height);

    const band = context.createLinearGradient(width * 0.08, 0, width * 0.92, 0);
    band.addColorStop(0, `${profile.baseColor}10`);
    band.addColorStop(0.18, `${profile.baseColor}aa`);
    band.addColorStop(0.5, `${profile.secondaryColor}ff`);
    band.addColorStop(0.82, `${profile.baseColor}aa`);
    band.addColorStop(1, `${profile.baseColor}10`);

    context.shadowColor = profile.baseColor;
    context.shadowBlur = 50 * profile.glowStrength;
    context.fillStyle = band;
    context.fillRect(width * 0.08, bandY, width * 0.84, bandHeight);
    context.shadowBlur = 0;

    for (let index = 0; index < profile.lineDensity; index += 1) {
      const x = width * (0.1 + random() * 0.8);
      const lineWidth = 1 + random() * 2;
      const alpha = 0.16 + random() * 0.4;
      context.fillStyle = `rgba(2, 6, 23, ${alpha})`;
      context.fillRect(x, bandY - height * 0.04, lineWidth, bandHeight + height * 0.08);
    }

    const particleCount = Math.floor(70 * profile.noiseAmount);
    for (let index = 0; index < particleCount; index += 1) {
      const x = random() * width;
      const y = random() * height;
      const radius = 0.5 + random() * 1.8;
      context.fillStyle = `rgba(255,255,255,${0.08 + random() * 0.25})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    context.strokeStyle = 'rgba(255,255,255,0.08)';
    context.lineWidth = 1;
    context.strokeRect(width * 0.08, bandY, width * 0.84, bandHeight);
  }, [profile, spectralType, starId]);

  return (
    <div className="glass-card rounded-[2rem] p-4 sm:p-6">
      <div className="mb-4 text-left">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Spectrum Inspired Visual</p>
        <p className="mt-2 text-sm text-white/55">Built from spectral class {profile.spectralClass}, not from live spectrum retrieval.</p>
      </div>
      <canvas ref={canvasRef} width={840} height={360} className="w-full rounded-[1.5rem] border border-white/8 bg-[#020617]" />
    </div>
  );
}
