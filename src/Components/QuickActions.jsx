// src/components/QuickActions.jsx
export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <button className="bg-primary text-white p-4 rounded-lg hover:bg-primary-dark transition-colors">
        Add New Hotel
      </button>
      <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
        Approve Registrations
      </button>
    </div>
  );
}