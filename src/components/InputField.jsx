/**
 * Reusable form input with label, prefix/suffix, and validation.
 */
export default function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  type = 'number',
  error,
  fullWidth,
  min,
  children,
}) {
  const wrapClass = `form-group${fullWidth ? ' full-width' : ''}`
  const inputClass = `form-input${error ? ' error' : ''}`

  // Custom child content (e.g. toggle, select)
  if (children) {
    return (
      <div className={wrapClass}>
        <label className="form-label">{label}</label>
        {children}
        {error && <span className="error-msg">{error}</span>}
      </div>
    )
  }

  const wrapperClasses = [
    prefix ? 'input-with-prefix' : '',
    suffix ? 'input-with-suffix' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapClass}>
      <label className="form-label">{label}</label>
      <div className={wrapperClasses || undefined}>
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          type={type}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
}
