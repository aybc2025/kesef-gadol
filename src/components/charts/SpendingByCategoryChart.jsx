import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { EXPENSE_CATEGORIES, findCategory } from '../../lib/categories'
import { formatMoney } from '../../lib/currency'

const BAR_COLORS = ['#4F9151', '#8FC08C', '#D8A339', '#E0725A', '#356B3B']

export function SpendingByCategoryChart({ data, currency }) {
  if (data.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 'var(--scale-sm)', padding: '24px' }}>
        אין הוצאות עדיין בתקופה הזו.
      </p>
    )
  }

  const chartData = data
    .map((d) => ({
      ...d,
      categoryLabel: findCategory(EXPENSE_CATEGORIES, d.category).label,
    }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <div style={{ width: '100%', height: Math.max(140, chartData.length * 44) }}>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="var(--line)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="categoryLabel"
            tick={{ fontSize: 12, fill: 'var(--ink)' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            formatter={(value) => formatMoney(value, currency)}
            contentStyle={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              fontSize: 12,
            }}
          />
          <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={entry.category} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
