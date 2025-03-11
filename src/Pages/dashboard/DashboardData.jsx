import React from 'react'
import MetricCard from '../../Components/MetricCard'

const DashboardData = React.memo(() => {
    return (
        <div className="ml-64 flex-1 p-8">
            <h2>Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Bookings"
                    value="1,234"
                    trend={12.5}
                    icon="📅"
                />
                <MetricCard
                    title="Monthly Revenue"
                    value="$45,678"
                    trend={8.2}
                    icon="💰"
                />
                <MetricCard
                    title="Active Hotels"
                    value="89"
                    trend={-3.1}
                    icon="🏨"
                />
                <MetricCard
                    title="Occupancy Rate"
                    value="78%"
                    trend={2.4}
                    icon="📊"
                />
            </div>

            {/* <QuickActions />

            <div className="grid md:grid-cols-2 gap-6">
                <ChartCard title="Booking Trends">
                    <div className="h-64 bg-gray-100 rounded-lg"></div>
                </ChartCard>
                <ChartCard title="Revenue Distribution">
                    <div className="h-64 bg-gray-100 rounded-lg"></div>
                </ChartCard>
            </div> */}
        </div>
    )
});

export default DashboardData
