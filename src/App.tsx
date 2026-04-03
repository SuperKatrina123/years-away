import { RefreshCw, Star } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { BirthDateForm } from './components/BirthDateForm.tsx';
import { SpectrumCanvas } from './components/SpectrumCanvas.tsx';
import { StarStoryCard } from './components/StarStoryCard.tsx';
import type {
  BirthDateFormValues,
  StarDetailResponseBody,
  StarMatchRequestBody,
  StarMatchResponseBody,
  StarMatchViewModel,
} from '../lib/types.ts';

type Step = 'landing' | 'result';

const initialValues: BirthDateFormValues = {
  name: '',
  birthDate: '',
};

async function postJson<TResponse, TRequest>(url: string, body: TRequest): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload;
}

async function getJson<TResponse>(url: string): Promise<TResponse> {
  const response = await fetch(url);
  const payload = (await response.json()) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed.');
  }

  return payload;
}

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [values, setValues] = useState<BirthDateFormValues>(initialValues);
  const [result, setResult] = useState<StarMatchViewModel | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof BirthDateFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const match = await postJson<StarMatchResponseBody, StarMatchRequestBody>('/api/star-match', {
        birthDate: values.birthDate,
        name: values.name,
      });
      const details = await getJson<StarDetailResponseBody>(`/api/star/${match.star.id}/details`);

      setResult({
        viewerName: values.name.trim(),
        ageYears: match.ageYears,
        star: details,
        storySeed: match.storySeed,
      });
      setStep('result');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('landing');
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen relative font-sans text-starlight selection:bg-white/20 overflow-x-hidden bg-[#020617]">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]" />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />

      <main className="relative z-10 min-h-screen">
        {step === 'landing' ? (
          <div className="grid md:grid-cols-2 min-h-screen">
            <section className="flex flex-col justify-center p-8 lg:p-16 xl:p-24 space-y-8">
              <div className="flex items-center gap-3 text-white/50 font-display tracking-[0.3em] uppercase text-[10px]">
                <div className="w-8 h-px bg-white/20" />
                <span>Years Away</span>
              </div>
              <div className="space-y-6 max-w-xl">
                <h1 className="text-5xl md:text-7xl font-hand font-medium leading-[1.05] tracking-tight glow-text text-white/90">
                  Meet the star that was already on its way to you.
                </h1>
                <p className="text-lg text-white/55 font-light leading-relaxed max-w-lg">
                  Enter a birth date and Years Away will match one star from a local catalog by approximate light-travel distance, then render a spectrum-inspired keepsake.
                </p>
              </div>
            </section>

            <section className="flex items-center justify-center p-8 lg:p-16 xl:p-24">
              <div className="w-full max-w-md">
                <BirthDateForm
                  values={values}
                  isLoading={isLoading}
                  error={error}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              </div>
            </section>
          </div>
        ) : result ? (
          <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16 min-h-screen flex flex-col justify-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <section className="order-2 lg:order-1 space-y-6">
                <SpectrumCanvas spectralType={result.star.spectralType} starId={result.star.id} />

                <button
                  onClick={handleReset}
                  className="min-w-[160px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-3 px-6 flex items-center justify-center gap-3 transition-all active:scale-[0.98] text-xs font-medium text-white/70"
                >
                  <RefreshCw size={16} />
                  Match Another
                </button>
              </section>

              <section className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
                <StarStoryCard match={result} />
              </section>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="relative z-10 container mx-auto px-6 py-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Star size={16} className="text-white/60" />
            </div>
            <span className="font-display font-medium tracking-[0.4em] uppercase text-xs">Years Away</span>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Match age, meet a star, keep the light.</p>
        </div>
      </footer>
    </div>
  );
}
