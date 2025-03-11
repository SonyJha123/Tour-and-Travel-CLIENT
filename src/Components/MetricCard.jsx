// src/components/MetricCard.jsx
export default function MetricCard({ title, value, trend, icon }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
        <div className={`mt-3 text-sm ${
          trend > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
        </div>
      </div>
    );
  }