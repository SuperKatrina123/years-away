/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, FormEvent } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Download, 
  Share2, 
  RefreshCw, 
  Star,
  ChevronLeft,
  MousePointer2,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface BirthData {
  name: string;
  date: string;
  time?: string;
  location: string;
}

// --- Components ---

const StarryBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const stars = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      depth: Math.random() * 20 + 10, // For parallax
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]" />
      
      {stars.map((star) => {
        const tx = useTransform(mouseX, (v) => (v - window.innerWidth / 2) / star.depth);
        const ty = useTransform(mouseY, (v) => (v - window.innerHeight / 2) / star.depth);
        
        return (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              x: tx,
              y: ty,
            }}
            animate={{
              opacity: [star.opacity, 0.1, star.opacity],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,41,59,0.2)_0%,transparent_80%)]" />
      
      {/* Nebula Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow delay-1000" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-slate-800/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow delay-2000" />
      
      {/* Stardust Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.6)_100%)] pointer-events-none" />
    </div>
  );
};

const CelestialDisk = ({ birthData, interactive = true, showLabels = false }: { birthData?: BirthData, interactive?: boolean, showLabels?: boolean }) => {
  const rotation = useMotionValue(0);
  const springRotation = useSpring(rotation, { stiffness: 50, damping: 20 });
  
  // Auto-rotation
  useEffect(() => {
    if (!interactive) return;
    const interval = setInterval(() => {
      rotation.set(rotation.get() + 0.05);
    }, 16);
    return () => clearInterval(interval);
  }, [rotation, interactive]);

  const seed = useMemo(() => {
    if (!birthData) return 12345;
    const str = `${birthData.date}-${birthData.time || 'anytime'}-${birthData.location}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }, [birthData]);

  const stars = useMemo(() => {
    const random = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 350 }).map((_, i) => {
      const r = 160 * Math.sqrt(random(seed + i));
      const theta = 2 * Math.PI * random(seed + i + 1000);
      return {
        id: i,
        x: 200 + r * Math.cos(theta),
        y: 200 + r * Math.sin(theta),
        size: random(seed + i + 2000) * 1.5 + 0.5,
        opacity: random(seed + i + 3000) * 0.6 + 0.2,
        isBright: random(seed + i + 4000) > 0.96,
      };
    });
  }, [seed]);

  const constellations = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 12; i++) {
      const startIdx = Math.floor((seed + i * 19) % 350);
      const endIdx = Math.floor((seed + i * 27 + 40) % 350);
      lines.push({ x1: stars[startIdx].x, y1: stars[startIdx].y, x2: stars[endIdx].x, y2: stars[endIdx].y });
    }
    return lines;
  }, [stars, seed]);

  return (
    <div className="relative group cursor-grab active:cursor-grabbing select-none">
      <motion.div
        style={{ rotate: springRotation }}
        drag={interactive ? "x" : false}
        onDrag={(_, info) => {
          rotation.set(rotation.get() + info.delta.x * 0.2);
        }}
        className={`rounded-full border border-white/10 star-map-container relative overflow-hidden shadow-[0_0_100px_rgba(30,41,59,0.4)] flex items-center justify-center ${
          showLabels 
            ? "w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[520px] lg:h-[520px] border-white/20 ring-8 ring-white/5" 
            : "w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]"
        }`}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
          {/* Orbital Rings */}
          <circle cx="200" cy="200" r="198" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.08" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.05" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.03" />
          
          {/* Coordinate Lines */}
          <line x1="200" y1="0" x2="200" y2="400" stroke="white" strokeWidth="0.3" strokeOpacity="0.05" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="white" strokeWidth="0.3" strokeOpacity="0.05" />

          {/* Constellations */}
          {constellations.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="white"
              strokeWidth="0.4"
              strokeOpacity="0.12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, delay: 1 + i * 0.1 }}
            />
          ))}
          
          {/* Stars */}
          {stars.map((star) => (
            <g key={star.id}>
              <circle
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill="white"
                fillOpacity={star.opacity}
              >
                {star.isBright && (
                  <animate
                    attributeName="opacity"
                    values={`${star.opacity}; 0.1; ${star.opacity}`}
                    dur={`${3 + Math.random() * 4}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              {star.isBright && (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.size * 3}
                  fill="white"
                  fillOpacity={star.opacity * 0.15}
                  className="blur-[1px]"
                />
              )}
            </g>
          ))}
        </svg>
        
        {/* Inner Glow & Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,6,23,0.9)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none" />
        
        {/* Labels */}
        {showLabels ? (
          <>
            {/* Glassy Rim Effect */}
            <div className="absolute inset-0 rounded-full border-[12px] border-white/5 pointer-events-none" />
            <div className="absolute inset-[12px] rounded-full border border-white/10 pointer-events-none" />
            
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] tracking-[0.6em] text-white/40 font-display uppercase pointer-events-none whitespace-nowrap">
              Born Under This Sky
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 pointer-events-none">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.6em] font-display">Birthlight</span>
            </div>
          </>
        ) : (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20 pointer-events-none">
            <div className="w-1 h-1 bg-white rounded-full" />
            <span className="text-[7px] uppercase tracking-[0.5em] font-display">Birthlight</span>
          </div>
        )}
      </motion.div>

      {/* Helper Text */}
      {interactive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/20 whitespace-nowrap"
        >
          <MousePointer2 size={10} />
          Drag to explore the sky
        </motion.div>
      )}

      {/* Decorative Labels */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] text-white/30 font-display uppercase pointer-events-none">Celestial North</div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.4em] text-white/30 font-display uppercase pointer-events-none">Celestial South</div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<'landing' | 'result'>('landing');
  const [birthData, setBirthData] = useState<BirthData>({
    name: '',
    date: '',
    time: '',
    location: ''
  });
  const [emotionalText, setEmotionalText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMessage = async (data: BirthData) => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const timeContext = data.time ? `at ${data.time}` : 'on that day';
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a short, deeply poetic, and emotional paragraph (2-3 sentences) for someone named ${data.name || 'a soul'} who was born on ${data.date} ${timeContext} in ${data.location}. The tone should be "Birthlight" - dreamy, celestial, and memorial. Focus on the cosmic significance of their arrival, as if the universe itself was waiting for this specific alignment. No hashtags, no emojis.`,
      });
      setEmotionalText(response.text || "The universe held its breath as you arrived, weaving a tapestry of light that only the stars could witness. This is the sky that watched over your first breath, a silent guardian of your journey.");
    } catch (error) {
      console.error("AI Generation failed:", error);
      setEmotionalText("The universe held its breath as you arrived, weaving a tapestry of light that only the stars could witness. This is the sky that watched over your first breath, a silent guardian of your journey.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep('result');
    generateMessage(birthData);
  };

  const handleBack = () => {
    setStep('landing');
  };

  return (
    <div className="min-h-screen relative font-sans text-starlight selection:bg-white/20 overflow-x-hidden">
      <StarryBackground />
      
      {/* Grain Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
      
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="grid md:grid-cols-2 min-h-screen relative"
            >
              {/* Left Side: Headline & Content */}
              <div className="flex flex-col justify-center p-8 lg:p-16 xl:p-24 space-y-12">
                <div className="space-y-8 max-w-xl">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 text-white/50 font-display tracking-[0.3em] uppercase text-[10px]"
                  >
                    <div className="w-8 h-px bg-white/20" />
                    <span>A Digital Cosmic Keepsake</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-6xl md:text-8xl font-hand font-medium leading-[1.1] tracking-tight glow-text text-white/90"
                  >
                    See the sky from the <br />
                    day you arrived.
                  </motion.h1>
                
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl text-white/50 font-hand font-light leading-relaxed max-w-md"
                  >
                    Turn your birth date into a personalized cosmic keepsake. Add your birth time for a more precise star map.
                  </motion.p>
                </div>
              </div>

              {/* Right Side: macOS Style Form */}
              <div className="flex items-center justify-center p-8 lg:p-16 xl:p-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="w-full max-w-md"
                >
                  <form 
                    onSubmit={handleSubmit} 
                    className="bg-[#1e1e1e]/80 backdrop-blur-3xl p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6"
                  >
                    <div className="space-y-1 mb-8">
                      <h2 className="text-lg font-medium text-white/90 tracking-tight">Birth Details</h2>
                      <p className="text-xs text-white/40">Enter your information to generate your map.</p>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-white/70 ml-0.5">Full Name</label>
                        <input
                          type="text"
                          placeholder="Optional"
                          className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:bg-black/40 transition-all placeholder:text-white/10 text-white/90"
                          value={birthData.name}
                          onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-white/70 ml-0.5">Birth Date</label>
                          <input
                            required
                            type="date"
                            className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:bg-black/40 transition-all [color-scheme:dark] text-white/90"
                            value={birthData.date}
                            onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                          />
                          {!birthData.date && (
                            <p className="text-[10px] text-red-400/70 flex items-center gap-1 mt-1">
                              <AlertCircle size={10} />
                              Required
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-white/70 ml-0.5">Birth Time</label>
                          <input
                            type="time"
                            className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:bg-black/40 transition-all [color-scheme:dark] text-white/90"
                            value={birthData.time}
                            onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-white/70 ml-0.5">Birth Location</label>
                        <input
                          required
                          type="text"
                          placeholder="City, Country"
                          className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:bg-black/40 transition-all placeholder:text-white/10 text-white/90"
                          value={birthData.location}
                          onChange={(e) => setBirthData({ ...birthData, location: e.target.value })}
                        />
                        {!birthData.location && (
                          <p className="text-[10px] text-red-400/70 flex items-center gap-1 mt-1">
                            <AlertCircle size={10} />
                            Location is required for coordinates
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-white/5 hover:bg-white/10 text-white/90 text-sm font-medium py-3 rounded-full transition-all active:scale-[0.98] border border-white/20 hover:border-white/40 backdrop-blur-md shadow-lg"
                      >
                        Generate Birth Sky
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-6 py-12 lg:py-16 relative min-h-[80vh] flex flex-col justify-center"
            >
              {/* Back Button */}
              <motion.button 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleBack}
                className="fixed top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white/80 transition-all text-[10px] font-display uppercase tracking-[0.4em] group z-50 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Earth
              </motion.button>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Star Map & Actions */}
                <div className="flex flex-col items-center gap-8 order-2 lg:order-1">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    className="flex justify-center"
                  >
                    <CelestialDisk birthData={birthData} interactive={false} showLabels={true} />
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex flex-wrap justify-center gap-4"
                  >
                    <button className="min-w-[160px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 px-6 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-xs font-medium text-white/70">
                      <Download size={16} />
                      Save Image
                    </button>
                    <button 
                      onClick={handleBack}
                      className="min-w-[160px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 px-6 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-xs font-medium text-white/70"
                    >
                      <RefreshCw size={16} />
                      Create Another
                    </button>
                  </motion.div>
                </div>

                {/* Right: Content */}
                <div className="space-y-8 order-1 lg:order-2 text-center lg:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <h2 className="text-4xl md:text-6xl font-serif font-medium glow-text leading-tight">
                      {birthData.name ? `${birthData.name}'s` : 'Your'} Birth Sky
                    </h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-white/40 font-display text-[10px] sm:text-[12px] uppercase tracking-[0.4em]">
                      <span>{new Date(birthData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      {birthData.time && <span>• {birthData.time}</span>}
                      <span>• {birthData.location}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="relative"
                  >
                    <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed italic font-serif max-w-xl">
                      {isGenerating ? (
                        <span className="flex items-center justify-center lg:justify-start gap-3 animate-pulse text-white/40">
                          <RefreshCw size={20} className="animate-spin" />
                          Consulting the stars...
                        </span>
                      ) : emotionalText}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Star size={16} className="text-white/60" />
            </div>
            <span className="font-display font-medium tracking-[0.4em] uppercase text-xs">Birthlight</span>
          </div>
          <div className="flex gap-10 text-[9px] uppercase tracking-[0.3em] text-white/20">
            <a href="#" className="hover:text-white/50 transition-colors">About</a>
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/50 transition-colors">Contact</a>
          </div>
          <p className="text-[9px] text-white/10 uppercase tracking-[0.3em]">© 2026 Birthlight Studio</p>
        </div>
      </footer>
    </div>
  );
}
