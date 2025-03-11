  // src/features/theme/ThemeProvider.js
  import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
  import { useSelector } from 'react-redux';

  export default function CustomThemeProvider({ children }) {
    const themeSettings = useSelector((state) => state.theme);

    const theme = createTheme({
      palette: {
        mode: themeSettings.mode,
        primary: { main: themeSettings.primaryColor },
        secondary: { main: themeSettings.secondaryColor },
      },
      shape: { borderRadius: themeSettings.borderRadius },
      typography: {
        fontFamily: themeSettings.fontFamily,
        button: { textTransform: 'none' }
      }
    });

    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
  }

// 1. Dashboard Overview
// Key Metrics
// Total bookings (weekly/monthly)
// Revenue summary
// Registered users/hotels count
// Occupancy rate (per hotel/room type)
// Visual Charts
// Booking trends (line chart)
// Revenue by hotel/room type (bar chart)
// Top-performing hotels (pie chart)
// Quick Actions
// Add new hotel/room
// Approve/reject pending registrations
// 2. Hotel Management
// Hotel List
// Search/filter by name, location, or rating
// Sort by registration date, popularity, or revenue
// Bulk actions (approve/disable hotels)
// Hotel Details
// Basic info (name, address, contact)
// Amenities/facilities
// Room types and pricing
// Gallery/image management
// Hotel Registration Approval
// Pending hotel requests (with verification status)
// Reject with reason (email notification)
// 3. Room Management
// Room Inventory
// Add/edit/delete rooms per hotel
// Set room types (e.g., Deluxe, Suite)
// Configure pricing (seasonal/dynamic)
// Availability Calendar
// View bookings per room
// Block dates for maintenance
// Room-Specific Data
// Max guests, bed configuration
// Facilities (AC, TV, etc.)
// Real-time occupancy status
// 4. User Management
// User List
// Filter by role (guest, hotel owner, admin)
// View registration source (Google, email, etc.)
// User Profiles
// Edit user details (e.g., block/unblock)
// View booking history
// Activity logs (logins, actions)
// Roles & Permissions
// Assign hotel ownership
// Grant/revoke admin access
// 5. Bookings & Reservations
// All Bookings
// Filter by date, hotel, or status (confirmed/canceled)
// Export to CSV/Excel
// Booking Details
// Guest info, payment status
// Modify booking dates/rooms
// Add special requests (e.g., breakfast)
// Cancellation Handling
// Process refunds
// Track cancellation reasons
// 6. Facilities & Amenities
// Global Facilities List
// Add/remove amenities (e.g., pool, gym)
// Assign to specific hotels
// Popularity Analytics
// Most-searched facilities
// Impact on booking rates
// 7. Reviews & Ratings
// Moderation
// Approve/reject guest reviews
// Flag inappropriate content
// Response Management
// Enable hotel owners to reply
// Track review resolution status
// 8. Reports & Analytics
// Financial Reports
// Revenue by hotel/room type
// Payment method breakdown
// User Behavior
// Top-searched destinations
// Conversion rates (search → booking)
// Custom Date Range Filters
// Compare performance across periods
// 9. Admin Settings
// Role-Based Access Control (RBAC)
// Define admin permissions (e.g., view-only, full access)
// System Configuration
// Set commission rates (if applicable)
// Configure payment gateways
// Audit Logs
// Track admin actions (e.g., "User X modified booking Y")
// Notification System
// Alerts for critical events (e.g., failed payments)
// 10. Support & Communication
// Helpdesk
// View guest/hotel owner queries
// Assign tickets to support agents
// Broadcast Messages
// Send announcements to users/hotels
// Email/SMS templates for common scenarios
// 11. Security & Compliance
// Data Privacy
// GDPR compliance tools (data deletion requests)
// Backup & Recovery
// Export database snapshots
// Restore previous states
