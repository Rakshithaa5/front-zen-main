import { MOODS, Mood } from '@/data/types';

interface MoodSelectorProps {
  onSelect: (mood: Mood) => void;
  selected?: Mood | null;
}

const MoodSelector = ({ onSelect, selected }: MoodSelectorProps) => {
  return (
    <section className="py-12">
      <h2 className="mb-2 text-center font-display text-3xl font-bold text-foreground">How are you feeling?</h2>
      <p className="mb-8 text-center text-muted-foreground">Pick your mood and we&apos;ll suggest the perfect food</p>
      <div className="flex flex-wrap justify-center gap-4">
        {MOODS.map(mood => (
          <button
            key={mood.label}
            onClick={() => onSelect(mood)}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-6 py-4 transition-all hover:scale-105 hover:shadow-lg ${
              selected?.label === mood.label
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <span className="text-4xl">{mood.emoji}</span>
            <span className="text-sm font-semibold text-foreground">{mood.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default MoodSelector;
