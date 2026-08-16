/**
 * Matrix block — comparison table with column headers and row data.
 * Scrollable horizontally on narrow viewports.
 */
interface MatrixProps {
  title: string
  columns: string[]
  rows: string[][]
  totalNote?: string
}

export function Matrix({ title, columns, rows, totalNote }: MatrixProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg overflow-hidden border border-line">
      <div className="px-5 py-3 bg-ink-2 border-b border-line">
        <span className="font-mono text-xs tracking-widest uppercase text-text-lo">
          {title}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-line">
              {columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-5 py-2.5 text-left font-mono text-xs tracking-wider uppercase text-text-lo bg-ink-1 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-line last:border-b-0 hover:bg-ink-2/50 transition-colors duration-100">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-5 py-3 font-body text-base leading-relaxed ${ci === 0 ? 'text-text-hi font-medium' : 'text-text-lo'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalNote && (
        <p className="px-5 pb-4 font-body text-sm text-text-lo">{totalNote}</p>
      )}
    </div>
  )
}
