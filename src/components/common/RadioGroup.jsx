export function RadioGroup({ label, name, options, register, error }) {
  return (
    <fieldset className="text-left text-sm text-gray-700">
      {label && <legend className="mb-1 font-medium">{label}</legend>}
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-1.5">
            <input
              type="radio"
              value={option.value}
              className="accent-primary-500"
              {...(register ? register(name) : { name })}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </fieldset>
  )
}
