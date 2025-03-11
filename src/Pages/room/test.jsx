import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import DatePicker from "react-multi-date-picker";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createRoom } from '../../features/room/roomSlice';
import 'bootstrap-daterangepicker/daterangepicker.css';

const Room = () => {
  // State Management
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('ANNUAL');
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [selectedBlackoutType, setSelectedBlackoutType] = useState('RANGE');
  const [dates, setDates] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [roomImages, setRoomImages] = useState({});
  const [allImages, setAllImages] = useState({});
  const [isAddingSupplement, setIsAddingSupplement] = useState(false);
  const [newSupplement, setNewSupplement] = useState({ 
    name: '', 
    price: '', 
    persons: '', 
    maxPrice: '' 
  });
  const [pricingData, setPricingData] = useState({});
  const [amenities, setAmenities] = useState({
    'Basic Room': {
      'Room Features': {
        options: [
          { name: 'Air Conditioning', selected: [] },
          { name: 'TV', selected: [] },
          { name: 'Free WiFi', selected: [] },
        ]
      },
      'Bathroom': {
        options: [
          { name: 'Private Bathroom', selected: [] },
          { name: 'Shower', selected: [] },
        ]
      },
      'Others': {
        options: []
      }
    }
  });
  const [newAmenity, setNewAmenity] = useState('');

  // Handler Functions
  const handleAddRoom = (setFieldValue, value) => {
    const newRooms = value.split(',').map(type => ({
      type: type.trim(),
      rooms: '',
      size: '',
      adults: '',
      children: '',
      pax: '',
    }));
    setRoomTypes(newRooms);
    setFieldValue('rooms', newRooms);
    
    // Initialize amenities for new room types
    const roomTypeNames = newRooms.map(room => room.type);
    setAmenities(prev => ({
      ...prev,
      'Basic Room': Object.fromEntries(
        Object.entries(prev['Basic Room']).map(([category, data]) => [
          category,
          {
            ...data,
            options: data.options.map(option => ({
              ...option,
              selected: roomTypeNames
            }))
          }
        ])
      )
    }));
  };

  const handleMealTypeChange = (mealType) => {
    setSelectedMealTypes(prev => 
      prev.includes(mealType) 
        ? prev.filter(type => type !== mealType) 
        : [...prev, mealType]
    );
  };

  const handlePlanChange = (e) => {
    setSelectedPlan(e.target.value);
  };

  const handleDateRangeChange = (start, end) => {
    const newRange = {
      type: "RANGE",
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      display: `${start.format('MMM D')} - ${end.format('MMM D')}`
    };
    setBlackoutDates(prev => [...prev, newRange]);
  };

  const handleDateSelectionComplete = () => {
    const formattedDates = dates.map(date => date.format('YYYY-MM-DD'));
    setBlackoutDates(prev => [
      ...prev, 
      { type: "DATE", dates: formattedDates, display: formattedDates.join(', ') }
    ]);
    setDates([]);
  };

  const handleImageUpload = (roomType, e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setAllImages(prev => ({
      ...prev,
      [roomType]: [...(prev[roomType] || []), ...newImages]
    }));
    setRoomImages(prev => ({
      ...prev,
      [roomType]: [...(prev[roomType] || []), ...files]
    }));
  };

  const removeImage = (roomType, index) => {
    setAllImages(prev => ({
      ...prev,
      [roomType]: prev[roomType].filter((_, i) => i !== index)
    }));
    setRoomImages(prev => ({
      ...prev,
      [roomType]: prev[roomType].filter((_, i) => i !== index)
    }));
  };

  const handleCheckboxChange = (category, amenityName, roomType) => {
    setAmenities(prev => {
      const newAmenities = { ...prev };
      const options = newAmenities['Basic Room'][category].options;
      const optionIndex = options.findIndex(opt => opt.name === amenityName);
      const newSelected = options[optionIndex].selected.includes(roomType)
        ? options[optionIndex].selected.filter(t => t !== roomType)
        : [...options[optionIndex].selected, roomType];
      
      options[optionIndex].selected = newSelected;
      return newAmenities;
    });
  };

  const handleAddSupplement = () => {
    if (isAddingSupplement) {
      setSupplements(prev => [...prev, newSupplement]);
      setNewSupplement({ name: '', price: '', persons: '', maxPrice: '' });
    }
    setIsAddingSupplement(!isAddingSupplement);
  };

  const deleteSupplement = (index) => {
    setSupplements(prev => prev.filter((_, i) => i !== index));
  };

  // Form Submission
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Basic Info
      formData.append('totalInventorySize', values.totalInventorySize);
      formData.append('roomTypes', JSON.stringify(roomTypes.map(rt => rt.type)));

      // Room Images
      Object.entries(roomImages).forEach(([roomType, files]) => {
        files.forEach(file => formData.append(`${roomType}_images`, file));
      });

      // Pricing Data
      formData.append('pricing', JSON.stringify({
        plan: selectedPlan,
        data: pricingData
      }));

      // Other Data
      formData.append('mealTypes', JSON.stringify(selectedMealTypes));
      formData.append('blackoutDates', JSON.stringify(blackoutDates));
      formData.append('supplements', JSON.stringify(supplements));
      formData.append('amenities', JSON.stringify(amenities));

      const result = await dispatch(createRoom(formData));
      
      if (createRoom.fulfilled.match(result)) {
        toast.success('Room created successfully!');
        navigate('/dashboard/rooms');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  // UI Components
  const FormCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      {children}
    </div>
  );

  const PrimaryButton = ({ children, ...props }) => (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      {...props}
    >
      {children}
    </button>
  );
  const FormRow = ({ label, children }) => (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      {children}
    </div>
  );

  return (
    <Formik
      initialValues={{
        totalInventorySize: '',
        addRoom: '',
        rooms: [],
      }}
      validationSchema={Yup.object({
        totalInventorySize: Yup.number().required().min(1).max(1000),
        addRoom: Yup.string().required(),
        rooms: Yup.array()
          .of(Yup.object().shape({
            rooms: Yup.number().required().min(1),
            size: Yup.string().required(),
            adults: Yup.number().required().min(1),
            children: Yup.number().required().min(0),
            pax: Yup.number().required().min(1),
          }))
          .required()
      })}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

<FormCard title="Room Configuration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormRow label="Total Inventory Size">
                <Field
                  name="totalInventorySize"
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="totalInventorySize" component="div" className="text-red-500 text-xs mt-1" />
              </FormRow>

              <FormRow label="Add Room Types (comma separated)">
                <Field
                  name="addRoom"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRoom(setFieldValue, values.addRoom)}
                />
                <ErrorMessage name="addRoom" component="div" className="text-red-500 text-xs mt-1" />
              </FormRow>
            </div>

            {roomTypes.length > 0 && (
              <div className="mt-6">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Room Type', 'Rooms', 'Size (sq.ft)', 'Adults', 'Children', 'Pax'].map((header) => (
                          <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {roomTypes.map((room, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{room.type}</td>
                          {['rooms', 'size', 'adults', 'children', 'pax'].map((field) => (
                            <td key={field} className="px-4 py-3">
                              <Field
                                name={`rooms[${index}].${field}`}
                                className="w-full px-2 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                type={field === 'size' ? 'text' : 'number'}
                              />
                              <ErrorMessage
                                name={`rooms[${index}].${field}`}
                                component="div"
                                className="text-red-500 text-xs mt-1"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </FormCard>

          <FormCard title="Meal Plans & Pricing">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Meal Types:</label>
                <div className="flex flex-wrap gap-2">
                  {['EPAI', 'CPAI', 'MAPAI', 'APAI'].map(mealType => (
                    <button
                      key={mealType}
                      type="button"
                      onClick={() => handleMealTypeChange(mealType)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedMealTypes.includes(mealType)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mealType}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMealTypes.length > 0 && (
                <>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Pricing Plan:</label>
                    <select
                      className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      onChange={handlePlanChange}
                      value={selectedPlan}
                    >
                      <option value="ANNUAL">Annual</option>
                      <option value="QUARTERLY">Quarterly</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Type</th>
                          {selectedMealTypes.map(mealType => (
                            <React.Fragment key={mealType}>
                              <th colSpan="5" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                {mealType}
                              </th>
                            </React.Fragment>
                          ))}
                        </tr>
                        <tr>
                          <th className="px-4 py-3"></th>
                          {selectedMealTypes.map(mealType => 
                            ['Single', 'Double', 'Extra Bed', 'Child', 'CNB'].map(label => (
                              <th key={`${mealType}-${label}`} className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                                {label}
                              </th>
                            ))
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {roomTypes.map(roomType => (
                          <tr key={roomType.type}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{roomType.type}</td>
                            {selectedMealTypes.flatMap(mealType => 
                              ['single', 'double', 'extraBed', 'child', 'noChild'].map(field => (
                                <td key={`${roomType.type}-${mealType}-${field}`} className="px-4 py-3">
                                  <Field
                                    name={`pricing.${selectedPlan}.${roomType.type}.${mealType}_based_Price.${field}`}
                                    type="number"
                                    className="w-full px-2 py-1 border rounded-md text-sm"
                                  />
                                </td>
                              ))
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </FormCard>

          {/* Blackout Dates Section */}
          <FormCard title="Blackout Dates">
            <div className="space-y-4">
              <select
                className="block w-full p-2 border rounded-lg mb-4"
                value={selectedBlackoutType}
                onChange={(e) => setSelectedBlackoutType(e.target.value)}
              >
                <option value="RANGE">Date Range</option>
                <option value="DATE">Specific Dates</option>
              </select>

              {selectedBlackoutType === 'RANGE' ? (
                <DateRangePicker onApply={(e, picker) => 
                  handleDateRangeChange(picker.startDate, picker.endDate)
                }>
                  <PrimaryButton type="button">
                    Select Date Range
                  </PrimaryButton>
                </DateRangePicker>
              ) : (
                <DatePicker
                  multiple
                  value={dates}
                  onChange={setDates}
                  onClose={handleDateSelectionComplete}
                >
                  <PrimaryButton type="button">
                    Select Specific Dates
                  </PrimaryButton>
                </DatePicker>
              )}

              {blackoutDates.map((blackout, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{blackout.display}</span>
                    <button 
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setBlackoutDates(prev => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left">Room Type</th>
                          {selectedMealTypes.map(meal => (
                            <th key={meal} className="text-center" colSpan="5">{meal}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {roomTypes.map(room => (
                          <tr key={room.type}>
                            <td>{room.type}</td>
                            {selectedMealTypes.map(meal => (
                              <td key={meal} className="space-x-2">
                                {['single', 'double', 'extraBed'].map(type => (
                                  <input
                                    key={type}
                                    type="number"
                                    className="w-20 p-1 border rounded"
                                    placeholder={`${type} price`}
                                    onChange={e => setFieldValue(
                                      `blackoutDates.${index}.${room.type}.${meal}.${type}`,
                                      e.target.value
                                    )}
                                  />
                                ))}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </FormCard>

          {/* Supplements Section */}
          <FormCard title="Supplements">
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Persons</th>
                    <th>Max Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supplements.map((supp, index) => (
                    <tr key={index}>
                      <td>{supp.name}</td>
                      <td>
                        <Field
                          name={`supplements.${index}.price`}
                          type="number"
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td>
                        <Field
                          name={`supplements.${index}.persons`}
                          type="number"
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td>
                        <Field
                          name={`supplements.${index}.maxPrice`}
                          type="number"
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteSupplement(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {isAddingSupplement && (
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={newSupplement.name}
                          onChange={e => setNewSupplement(prev => ({...prev, name: e.target.value}))}
                          className="w-full p-1 border rounded"
                          placeholder="Supplement name"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={newSupplement.price}
                          onChange={e => setNewSupplement(prev => ({...prev, price: e.target.value}))}
                          className="w-full p-1 border rounded"
                          placeholder="Price"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={newSupplement.persons}
                          onChange={e => setNewSupplement(prev => ({...prev, persons: e.target.value}))}
                          className="w-full p-1 border rounded"
                          placeholder="Persons"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={newSupplement.maxPrice}
                          onChange={e => setNewSupplement(prev => ({...prev, maxPrice: e.target.value}))}
                          className="w-full p-1 border rounded"
                          placeholder="Max Price"
                        />
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
              <PrimaryButton type="button" onClick={handleAddSupplement}>
                {isAddingSupplement ? 'Save Supplement' : 'Add Supplement'}
              </PrimaryButton>
            </div>
          </FormCard>

          {/* Image Upload Section */}
          <FormCard title="Room Images">
            {roomTypes.map(room => (
              <div key={room.type} className="mb-6">
                <h4 className="font-medium mb-2">{room.type} Images</h4>
                <div className="grid grid-cols-3 gap-4">
                  {(allImages[room.type] || []).map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`${room.type} ${index}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(room.type, index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(room.type, e)}
                    />
                    <span className="text-gray-500">Upload Images</span>
                  </label>
                </div>
              </div>
            ))}
          </FormCard>

          {/* Amenities Section */}
          <FormCard title="Amenities">
            {Object.entries(amenities['Basic Room']).map(([category, data]) => (
              <div key={category} className="mb-6">
                <h4 className="font-medium mb-3">{category}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {data.options.map((option, index) => (
                    <div key={index} className="border p-3 rounded-lg">
                      <div className="font-medium mb-2">{option.name}</div>
                      <div className="flex flex-wrap gap-3">
                        {roomTypes.map(room => (
                          <label key={room.type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={option.selected.includes(room.type)}
                              onChange={() => handleCheckboxChange(category, option.name, room.type)}
                              className="mr-1"
                            />
                            {room.type}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="New amenity"
                className="flex-1 p-2 border rounded-lg"
              />
              <PrimaryButton
                type="button"
                onClick={() => {
                  setAmenities(prev => ({
                    ...prev,
                    'Basic Room': {
                      ...prev['Basic Room'],
                      'Others': {
                        options: [...prev['Basic Room'].Others.options, { 
                          name: newAmenity, 
                          selected: roomTypes.map(rt => rt.type) 
                        }]
                      }
                    }
                  }));
                  setNewAmenity('');
                }}
              >
                Add Amenity
              </PrimaryButton>
            </div>
          </FormCard>

          <div className="mt-8 flex justify-end">
            <PrimaryButton type="submit">
              Save Room
            </PrimaryButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Room;