import { useState } from 'react';
import HotelTable from './HotelTable';
import HotelModal from './HotelModal';
import Sidebar from '../../Components/sidebar/Sidebar';

export default function Hotels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-100 pt-20">
      <div className="fixed left-0 top-0 h-full w-64">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Hotel Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add New Hotel
          </button>
        </div>

        <HotelTable
          onEdit={(hotel) => {
            setSelectedHotel(hotel);
            setIsModalOpen(true);
          }}
        />

        <HotelModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedHotel(null);
          }}
          hotel={selectedHotel}
        />
      </div>
    </div>
  );
}