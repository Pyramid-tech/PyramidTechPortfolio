'use client';

interface Props<T extends string> {
  legend: string;
  options: readonly T[];
  labels: Record<T, string>;
  selected: T[];
  onToggle: (value: T) => void;
  error?: string;
}

export default function CheckboxGroup<T extends string>({
  legend,
  options,
  labels,
  selected,
  onToggle,
  error,
}: Props<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs uppercase tracking-widest text-text-1/50">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.includes(option);
          return (
            <label
              key={option}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition focus-within:ring-2 focus-within:ring-primary ${
                checked
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-stroke text-text-1/60 hover:border-text-1/40 hover:text-text-1'
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onToggle(option)}
              />
              {labels[option]}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </fieldset>
  );
}
