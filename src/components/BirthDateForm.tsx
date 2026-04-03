import type { FormEvent } from 'react';
import type { BirthDateFormValues } from '../../lib/types.ts';

interface BirthDateFormProps {
  values: BirthDateFormValues;
  isLoading: boolean;
  error: string;
  onChange: (field: keyof BirthDateFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function BirthDateForm({ values, isLoading, error, onChange, onSubmit }: BirthDateFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-[#1e1e1e]/80 backdrop-blur-3xl p-8 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6">
      <div className="space-y-1 mb-8">
        <h2 className="text-lg font-medium text-white/90 tracking-tight">Birth Date</h2>
        <p className="text-xs text-white/40">A poetic astronomy keepsake matched by approximate light-travel distance.</p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-white/70 ml-0.5">Name</label>
          <input
            type="text"
            placeholder="Optional"
            className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all placeholder:text-white/10 text-white/90"
            value={values.name}
            onChange={(event) => onChange('name', event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-white/70 ml-0.5">Birth Date</label>
          <input
            required
            type="date"
            className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all [color-scheme:dark] text-white/90"
            value={values.birthDate}
            onChange={(event) => onChange('birthDate', event.target.value)}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-60 disabled:cursor-wait text-white/90 text-sm font-medium py-3 rounded-full transition-all active:scale-[0.98] border border-white/20 hover:border-white/40"
      >
        {isLoading ? 'Matching Star...' : 'Find My Star'}
      </button>
    </form>
  );
}
