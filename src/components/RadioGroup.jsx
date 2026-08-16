export default function RadioGroup({ label, name, options, value, onChange, error }) {
  return (
    <fieldset className="flex flex-col gap-2">
      {label && <legend className="text-sm font-semibold text-ink">{label}</legend>}
      <div className="flex items-center gap-6">
        {options.map((option) => (
          <label key={String(option.value)} className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="size-4 accent-primary"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </fieldset>
  );
}
