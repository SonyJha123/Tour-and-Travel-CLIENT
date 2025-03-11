// src/components/ChartCard.jsx
export default function ChartCard({ title, children }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-64">{children}</div>
      </div>
    );
  }