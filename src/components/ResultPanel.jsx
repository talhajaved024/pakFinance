/**
 * Dark accent panel that displays key result metrics.
 *
 * @param {{ title: string, items: Array<{ label: string, value: string, highlight?: boolean, sub?: string }> }} props
 */
export default function ResultPanel({ title, items }) {
  return (
    <div className="result-panel">
      <h3>{title}</h3>
      <div className="result-grid">
        {items.map((item, i) => (
          <div className="result-item" key={i}>
            <label>{item.label}</label>
            <div className={`value${item.highlight ? ' highlight' : ''}`}>
              {item.value}
            </div>
            {item.sub && <div className="sub">{item.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
