import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatMoney } from '../../lib/currency'

export function BalanceOverTimeChart({ data, currency }) {
  if (data.length < 2) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 'var(--scale-sm)', padding: '24px' }}>
        ככל שתוסיפו תנועות, כאן יופיע גרף ההתקדמות שלכם.
      </p>
    )
  }

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--line)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--ink-soft)' }}
            axisLine={{ stroke: 'var(--line)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--ink-soft)' }}
            axisLine={false}
            tickLine={false}
            width={44}
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
          <Line
            type="monotone"
            dataKey="balance"
            stroke="var(--green-500)"
            strokeWidth={3}
            dot={{ r: 3, fill: 'var(--green-700)' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
