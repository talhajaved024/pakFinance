/**
 * Styled explanation / info box.
 */
export default function ExplanationSection({ title, children }) {
  return (
    <div className="explanation">
      <h3>{title}</h3>
      {children}
    </div>
  )
}
