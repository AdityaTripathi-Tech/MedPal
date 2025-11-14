import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export default function AdherenceChart({ data, type = 'line' }) {
  if (!data || data.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No adherence data available yet</p>
      </div>
    )
  }

  const formattedData = data.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    taken: item.taken_count,
    missed: item.missed_count,
    total: item.taken_count + item.missed_count,
    adherence: item.taken_count + item.missed_count > 0 
      ? Math.round((item.taken_count / (item.taken_count + item.missed_count)) * 100)
      : 0
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800 mb-1">{payload[0].payload.date}</p>
          <p className="text-sm text-green-600">Taken: {payload[0].payload.taken}</p>
          <p className="text-sm text-red-600">Missed: {payload[0].payload.missed}</p>
          <p className="text-sm text-primary-600 font-medium mt-1">
            Adherence: {payload[0].payload.adherence}%
          </p>
        </div>
      )
    }
    return null
  }

  if (type === 'bar') {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Adherence</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="taken" fill="#10b981" name="Taken" radius={[8, 8, 0, 0]} />
            <Bar dataKey="missed" fill="#ef4444" name="Missed" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Adherence Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="adherence" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            name="Adherence %"
            dot={{ fill: '#0ea5e9', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
