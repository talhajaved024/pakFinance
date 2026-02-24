/**
 * Segmented toggle / tab selector.
 * @param {{ options: {label:string, value:string}[], value: string, onChange: function }} props
 */
export default function Toggle({ options, value, onChange }) {
  return (
    <div className="toggle-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`toggle-btn${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
