import React from 'react';
import Sidebar from '../../Components/sidebar/Sidebar';
import DashboardData from './DashboardData';

const Dashboard = () => {
    return (
        <>
            <div className="flex min-h-screen bg-gray-100 pt-20">
                <div className="fixed left-0 top-0 h-full w-64">
                    <Sidebar />
                </div>
                <DashboardData />

            </div>
        </>
    );
};

export default Dashboard;


