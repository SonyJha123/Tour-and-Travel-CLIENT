// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';

const links = [
  { path: '/dashboard', name: 'Dashboard', icon: '🏠' },
  // { path: '/hotels', name: 'Hotels', icon: '🏨' },
//   { path: '/users', name: 'Users', icon: '👥' },
//   { path: '/bookings', name: 'Bookings', icon: '📅' },
//   { path: '/settings', name: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg pt-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-8">Hotel Admin</h1>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span className="mr-3 text-xl">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}