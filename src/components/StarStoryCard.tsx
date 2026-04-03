import type { StarMatchViewModel } from '../../lib/types.ts';

interface StarStoryCardProps {
  match: StarMatchViewModel;
}

function buildStory(match: StarMatchViewModel) {
  const intro = match.viewerName
    ? `${match.viewerName} is matched with`
    : 'You are matched with';
  return `${intro} ${match.star.name}, a star in ${match.star.constellation} chosen by approximate light-travel distance. At about ${match.star.distanceLightYear.toFixed(1)} light-years away, its light arrives within roughly ${match.storySeed.distanceDelta.toFixed(1)} years of your age, making this a poetic astronomy keepsake inspired by stellar spectroscopy.`;
}

export function StarStoryCard({ match }: StarStoryCardProps) {
  return (
    <div className="glass-card rounded-[2rem] p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Matched Star</p>
        <h2 className="text-4xl md:text-6xl font-serif font-medium glow-text leading-tight">{match.star.name}</h2>
        <p className="text-white/55">{match.star.constellation}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-white/35 uppercase tracking-[0.2em] text-[10px]">Age</p>
          <p className="mt-2 text-white/80 text-lg">{match.ageYears} years</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-white/35 uppercase tracking-[0.2em] text-[10px]">Distance</p>
          <p className="mt-2 text-white/80 text-lg">{match.star.distanceLightYear.toFixed(1)} ly</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-white/35 uppercase tracking-[0.2em] text-[10px]">Spectral Type</p>
          <p className="mt-2 text-white/80 text-lg">{match.star.spectralType}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
          <p className="text-white/35 uppercase tracking-[0.2em] text-[10px]">Magnitude</p>
          <p className="mt-2 text-white/80 text-lg">{match.star.magnitude}</p>
        </div>
      </div>

      <p className="text-base md:text-lg text-white/62 font-light leading-relaxed italic font-serif max-w-xl">
        There is a star whose light began traveling toward you around the time you were born. Years later, you finally meet it.
      </p>

      <p className="text-sm md:text-base text-white/58 leading-relaxed max-w-xl">
        {buildStory(match)}
      </p>
    </div>
  );
}
