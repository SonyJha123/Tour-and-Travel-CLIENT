import React, { useCallback,useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CustomInput from '../../Components/CustomInput';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap/dist/css/bootstrap.css';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from "react-multi-date-picker";
import { toast } from 'react-toastify';
import { createRoom } from '../../features/room/roomSlice';
import { useDispatch } from 'react-redux';

const Room = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const locationData = location.state;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedMealTypes, setSelectedMealTypes] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState('ANNUAL');
    const [blackoutDates, setBlackoutDates] = useState([]);
    const [selectedBlackoutType, setSelectedBlackoutType] = useState('RANGE');
    const [dates, setDates] = useState([]);
    const [newSupplementMaxPrice, setNewSupplementMaxPrice] = useState('');
    const [supplements, setSupplements] = useState([
        { name: 'Gala Dinner', price: null, persons: null, maxPrice: null },
        { name: 'Candlelight Dinner', price: null, persons: null, maxPrice: null },
        { name: 'DJ Party', price: null, persons: null, maxPrice: null },
        { name: 'High Tea', price: null, persons: null, maxPrice: null },
    ]);
    const [roomImages, setRoomImages] = useState(() => {
        const initialImages = {};
        roomTypes.forEach(room => {
            initialImages[room.type] = [];
        });
        return initialImages;
    });
    const [allImages, setAllImages] = useState(() => {
        const initialImages = {};
        roomTypes.forEach(room => {
            initialImages[room.type] = [];
        });
        return initialImages;
    });
    const [isAddingSupplement, setIsAddingSupplement] = useState(false);
    const [newSupplementName, setNewSupplementName] = useState('');
    const [newSupplementPrice, setNewSupplementPrice] = useState('');
    const [newSupplementPersons, setNewSupplementPersons] = useState('');
    const [pricingData, setPricingData] = useState({});

    const [amenities, setAmenities] = useState([
        {
            name: 'Room Features',
            isAdding: false,
            subcategories: [
                { name: 'Air Conditioning', selected: roomTypes.map(rt => rt.type) },
                { name: 'TV', selected: roomTypes.map(rt => rt.type) },
                { name: 'Free WiFi', selected: roomTypes.map(rt => rt.type) },
                { name: 'Mini Fridge', selected: roomTypes.map(rt => rt.type) },
                { name: 'Coffee Maker', selected: roomTypes.map(rt => rt.type) }
            ]
        },
        {
            name: 'Bathroom',
            isAdding: false,
            subcategories: [
                { name: 'Private Bathroom', selected: roomTypes.map(rt => rt.type) },
                { name: 'Shower', selected: roomTypes.map(rt => rt.type) },
                { name: 'Toiletries', selected: roomTypes.map(rt => rt.type) },
                { name: 'Hair Dryer', selected: roomTypes.map(rt => rt.type) }
            ]
        },
        {
            name: 'Bar',
            isAdding: false,
            subcategories: [
                { name: 'Mini Bar', selected: [] },
                { name: 'Cocktail Service', selected: [] },
                { name: 'Wine Selection', selected: [] }
            ]
        },
        {
            name: 'Entertainment',
            isAdding: false,
            subcategories: [
                { name: 'Cable TV', selected: [] },
                { name: 'Streaming Services', selected: [] },
                { name: 'Game Console', selected: [] }
            ]
        },
        {
            name: 'Refreshment_DiningAmenities',
            isAdding: false,
            subcategories: [
                { name: '24/7 Room Service', selected: [] },
                { name: 'Breakfast Buffet', selected: [] },
                { name: 'Snack Bar', selected: [] }
            ]
        },
        {
            name: 'Safety_security',
            isAdding: false,
            subcategories: [
                { name: 'Safe Deposit Box', selected: [] },
                { name: 'Fire Extinguisher', selected: [] },
                { name: 'Security Cameras', selected: [] }
            ]
        },
        {
            name: 'Others',
            isAdding: true,
            subcategories: []
        }
    ]);
    
    const [newSubcategory, setNewSubcategory] = useState("");
    const [customAmenity, setCustomAmenity] = useState("");
    const [quarterPlan, setQuarterPlan] = useState('Jan-Mar');
    const [showQuarterPlan, setShowQuarterPlan] = useState(false);

    const handlePlanChange = (e) => {
        setSelectedPlan(e.target.value);
        if (e.target.value === 'QUARTERLY') {
            setShowQuarterPlan(true);
        } else {
            setShowQuarterPlan(false);
            setQuarterPlan('');
        }
    };

    const handleQuarterPlanChange = (e) => {
        setQuarterPlan(e.target.value);
    };


    const toggleAddSubcategory = (index) => {
        const updatedAmenities = [...amenities];
        updatedAmenities[index].isAdding = !updatedAmenities[index].isAdding;
        setAmenities(updatedAmenities);
    };

    const handleAddSubcategory = (mainIndex) => {
        if (newSubcategory.trim()) {
            const updatedAmenities = [...amenities];
            updatedAmenities[mainIndex].subcategories.push({
                name: newSubcategory.trim(),
                selected: roomTypes.map(rt => rt.type)
            });
            setAmenities(updatedAmenities);
            setNewSubcategory("");
            updatedAmenities[mainIndex].isAdding = false;
        }
    };

    const handleCheckboxChange = (mainIndex, subIndex, roomType) => {
        setAmenities(prev => {
            const updated = [...prev];
            const subcategory = updated[mainIndex].subcategories[subIndex];
            const index = subcategory.selected.indexOf(roomType);

            if (index === -1) {
                subcategory.selected.push(roomType);
            } else {
                subcategory.selected.splice(index, 1);
            }

            return updated;
        });
    };

    const initializePricingData = useCallback(() => {
        const pricingData = {
            ANNUAL: {},
            QUARTERLY: {},
        };
        roomTypes.forEach(roomType => {
            pricingData.ANNUAL[roomType.type] = {};
            pricingData.QUARTERLY[roomType.type] = {};
            selectedMealTypes.forEach(mealPlan => {
                pricingData.ANNUAL[roomType.type][`${mealPlan}_based_Price`] = {
                    single: "",
                    double: "",
                    extraBed: "",
                    child: "",
                    noChild: "",
                };
                pricingData.QUARTERLY[roomType.type][`${mealPlan}_based_Price`] = {
                    single: "",
                    double: "",
                    extraBed: "",
                    child: "",
                    noChild: "",
                };
            });
        });
    
        return pricingData;
    }, [roomTypes, selectedMealTypes]);
    
    useEffect(() => {
        setPricingData(initializePricingData());
    }, [initializePricingData]);

    const handleMealTypeChange = (mealType) => {
        setSelectedMealTypes((prev) =>
            prev.includes(mealType) ? prev.filter(type => type !== mealType) : [...prev, mealType]
        );
    };

    const handlePricingChange = (roomType, mealType, priceType, value) => {
        setPricingData(prev => ({
            ...prev,
            [selectedPlan]: {
                ...prev[selectedPlan],
                [roomType]: {
                    ...prev[selectedPlan][roomType],
                    [`${mealType}_based_Price`]: {
                        ...prev[selectedPlan][roomType][`${mealType}_based_Price`],
                        [priceType]: value
                    }
                }
            }
        }));
    };

    const handleDateRangeChange = (start, end) => {
        const newRange = {
            type: "RANGE",
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD'),
            display: `${start.format('MMM D')} - ${end.format('MMM D')}`
        };
        const isStartDateAlreadySelected = blackoutDates.some(entry =>
            entry.type === "RANGE" &&
            start.isSameOrAfter(entry.start, 'day') &&
            start.isBefore(entry.end, 'day')
        );
        if (isStartDateAlreadySelected) {
            alert(`The start date ${start.format('MMM D')} is already part of an existing range.`);
            return;
        }
        const isDuplicate = blackoutDates.some(entry =>
            entry.type === "RANGE" &&
            entry.start === newRange.start &&
            entry.end === newRange.end
        );
        if (isDuplicate) {
            alert(`The date range ${newRange.display} already exists.`);
            return;
        }
        setBlackoutDates(prev => [...prev, newRange]);
    };

    const handleDateSelectionComplete = () => {
        if (dates.length === 0) return;
        const formattedDates = dates.map(date =>
            date.toDate().toLocaleDateString('en-GB')
        );
        const existingDates = new Set();
        blackoutDates.forEach(entry => {
            if (entry.type === "DATE") {
                entry.dates.forEach(date => existingDates.add(date));
            }
        });
        const uniqueNewDates = formattedDates.filter(date => !existingDates.has(date));
        const duplicateDates = formattedDates.filter(date => existingDates.has(date));
        if (duplicateDates.length > 0) {
            alert(`These dates: ${duplicateDates.join(', ')} are already selected`);
        }
        if (uniqueNewDates.length === 0) {
            setDates([]);
            return;
        }
        const newEntry = {
            type: "DATE",
            dates: uniqueNewDates,
            display: uniqueNewDates.join(', ')
        };
        setBlackoutDates(prev => [...prev, newEntry]);
        setDates([]);
    };

    const handleDateRangeCustomChange = (datesArray) => {
        setDates(datesArray);
    };

    const handleAddRoom = (setFieldValue, addRoomValue) => {
        const roomInput = addRoomValue.trim();
        if (roomInput) {
            const types = roomInput.split(',').map(type => type.trim()).filter(type => type);
            const newRooms = types.map(type => ({
                type,
                rooms: '',
                size: '',
                adults: '',
                children: '',
                pax: '',
            }));
            setRoomTypes(newRooms);
            setFieldValue('rooms', newRooms);
            setAmenities(prevAmenities => prevAmenities.map(mainCategory => ({
                ...mainCategory,
                subcategories: mainCategory.subcategories.map(subcategory => ({
                    ...subcategory,
                    selected: subcategory.selected.concat(types)
                }))
            })));
        }
    };

    const handleAddSupplement = (setFieldValue) => {
        if (isAddingSupplement && newSupplementName.trim()) {
            const newSupplement = {
                name: newSupplementName.trim(),
                price: newSupplementPrice,
                persons: newSupplementPersons,
                maxPrice: newSupplementMaxPrice
            };
            setSupplements([...supplements, newSupplement]);
            setFieldValue('supplements', [...supplements, newSupplement]);
            setNewSupplementName('');
            setNewSupplementPrice('');
            setNewSupplementPersons('');
            setNewSupplementMaxPrice('');
        }
        setIsAddingSupplement(!isAddingSupplement);
    };

    const handleDeleteSupplement = (index) => {
        setSupplements(supplements.filter((supplement, i) => i !== index));
    };

    const removeImage = (roomType, imageIndex) => {
        setAllImages(prevImages => ({
            ...prevImages,
            [roomType]: prevImages[roomType].filter((_, idx) => idx !== imageIndex),
        }));
    };

    const handleImageUpload = (roomType, event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => file);
        const newAllImages = (files.map(file => URL.createObjectURL(file)))
        setAllImages(prevImages => {
            return {
                ...prevImages,
                [roomType]: [...(prevImages[roomType] || []), ...newAllImages],
            }
        })
        setRoomImages(prevImages => ({
            ...prevImages,
            [roomType]: [...(prevImages[roomType] || []), ...newImages],
        }));
    };

    const handleAddCustomAmenity = (mainIndex) => {
        if (customAmenity.trim()) {
            setAmenities(prev => {
                const updated = [...prev];
                updated[mainIndex].subcategories.push({
                    name: customAmenity.trim(),
                    selected: roomTypes.map(rt => rt.type)
                });
                return updated;
            });
            setCustomAmenity("");
        }
    };
    const handleDeleteSubcategory = (mainIndex, subIndex) => {
        setAmenities(prev => {
            const updated = [...prev];
            updated[mainIndex].subcategories = updated[mainIndex].subcategories.filter((_, i) => i !== subIndex);
            return updated;
        });
    };


    const initialValues = {
        totalInventorySize: '',
        addRoom: '',
        rooms: [],
        blackoutDates: {
            Duration_type: 'RANGE',
            Duration_Month_Date: '',
            roomTypes: []
        },
        blackoutDatesCustom: {
            Duration_type: 'DATE',
            Duration_Month_Date: [],
            roomTypes: []
        },
        supplements: [],
    };

    const validationSchema = Yup.object().shape({
        totalInventorySize: Yup.number()
            .required('Total Inventory Size is required')
            .max(1000, 'Total Inventory Size cannot exceed 1000'),

        addRoom: Yup.string()
            .required('Room type is required'),

        rooms: Yup.array()
            .of(
                Yup.object().shape({
                    rooms: Yup.number().required('Number of room is required').min(1, 'Must be at least 1'),
                    size: Yup.string().required('Room Size is required'),
                    adults: Yup.number()
                        .required('Adults is required')
                        .min(1, 'Must be at least 1')
                        .max(Yup.ref('pax'), 'Number of adults must not exceed PAX'),
                    children: Yup.number()
                        .required('Children is required')
                        .min(0, 'Cannot be negative')
                        .max(Yup.ref('pax'), 'Number of children must not exceed PAX')
                        .test('children-max', 'Number of children must not exceed PAX - 1', function (value) {
                            const { pax } = this.parent;
                            return value <= pax - 1;
                        }),
                    pax: Yup.number()
                        .required('Total Pax is required')
                        .min(1, 'Must be at least 1'),
                })
            )
            .required('At least one room is required')
            .min(1, 'At least one room is required')
            .test('inventory-size-equal', 'No. of Rooms must be less than or equal to the sum of Total Inventory Size', function (rooms) {
                const { totalInventorySize } = this.parent;
                const totalRooms = rooms.reduce((acc, room) => acc + (room.rooms || 0), 0);
                return totalRooms <= totalInventorySize;
            })
    });

    const onSubmit = async (values) => {
        const totalNumberOfRooms = values.totalInventorySize;
        const roomCountandCapacity = {};
        values.rooms.forEach(room => {
            roomCountandCapacity[room.type] = {
                roomCount: Number(room.rooms),
                roomSize: String(room.size),
                totalPax: Number(room.pax),
                maxChildren: Number(room.children),
                maxAdults: Number(room.adults),
            };
        });
        const mealTypes = selectedMealTypes.join(", ");
        const pricing = {
            pricingPlan: selectedPlan,
            ...(quarterPlan && { duration: quarterPlan })
        };
        
        roomTypes.forEach(roomType => {
            pricing[roomType.type] = {};
            selectedMealTypes.forEach(mealType => {
                pricing[roomType.type][`${mealType}_based_Price`] = {
                    single: pricingData[selectedPlan][roomType.type][`${mealType}_based_Price`]?.single || 0,
                    double: pricingData[selectedPlan][roomType.type][`${mealType}_based_Price`]?.double || 0,
                    extraBed: pricingData[selectedPlan][roomType.type][`${mealType}_based_Price`]?.extraBed || 0,
                    child: pricingData[selectedPlan][roomType.type][`${mealType}_based_Price`]?.child || 0,
                    noChild: pricingData[selectedPlan][roomType.type][`${mealType}_based_Price`]?.noChild || 0,
                };
            });
        });

        const blackoutData = blackoutDates.map((blackout, index) => {
            const entry = {
                durationType: blackout.type,
                duration: blackout.type === 'RANGE'
                    ? `${blackout.start} - ${blackout.end}`
                    : blackout.dates.join(', '),
            };
            roomTypes.forEach(roomType => {
                entry[roomType.type] = {};

                selectedMealTypes.forEach(mealType => {
                    entry[roomType.type][`${mealType}_based_Price`] = {
                        single: values.blackoutDates?.[index]?.[roomType.type]?.[mealType]?.single || 0,
                        double: values.blackoutDates?.[index]?.[roomType.type]?.[mealType]?.double || 0,
                        extraBed: values.blackoutDates?.[index]?.[roomType.type]?.[mealType]?.extraBed || 0,
                        child: values.blackoutDates?.[index]?.[roomType.type]?.[mealType]?.child || 0,
                        noChild: values.blackoutDates?.[index]?.[roomType.type]?.[mealType]?.noChild || 0,
                    };
                });
            });

            return entry;
        });

        const roomAmenities = {};

        roomTypes.forEach(roomType => {
            roomAmenities[roomType.type] = {};
            amenities.forEach(mainCategory => {
                roomAmenities[roomType.type][mainCategory.name] = [];
                mainCategory.subcategories.forEach(subcategory => {
                    if (subcategory.selected.includes(roomType.type)) {
                        roomAmenities[roomType.type][mainCategory.name].push(subcategory.name);
                    }
                });
            });
        });
        const plainData = {
            totalNumberOfRooms: totalNumberOfRooms,
            roomType: JSON.stringify(Object.keys(roomCountandCapacity)),
            roomCountandCapacity: JSON.stringify(roomCountandCapacity),
            mealType: JSON.stringify(mealTypes),
            pricing: JSON.stringify(pricing),
            roomAmenities: JSON.stringify(roomAmenities),
            blackoutdatePricing: JSON.stringify(blackoutData),
            supplements: JSON.stringify(supplements),
            hotelId: locationData ? locationData.hotel._id : "67c15bdd9a1cf3b6e6d2d7a5",
            roomImages: roomImages,
        };
        try {
            setLoading(true);
            const resultAction = await dispatch(createRoom(plainData));
            if (createRoom.fulfilled.match(resultAction)) {
                const successMessage = resultAction.payload.message || 'Room created successfully!';
                toast.success(successMessage);
                navigate('/facilities', {
                    state: {
                        data: resultAction.payload,
                        hotelData: locationData?.hotel,
                    }
                });
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ setFieldValue, errors, touched, values }) => (
                <Form className="p-20">
                    {loading &&
                        <div className="fixed inset-0 flex items-center justify-center bg-white z-50 opacity-100 transition-opacity duration-200">
                            <img src="https://miro.medium.com/v2/resize:fit:750/format:webp/1*Q2PjhTNC1RvTbm7xsAv8-Q.gif" alt="spinner" />
                        </div>
                    }
                    <h3 className="text-2xl font-bold mb-4 text-center">Room Information</h3>
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 pb-5'>
                        <CustomInput
                            id="totalInventorySize"
                            name="totalInventorySize"
                            placeholder="Total Inventory Size"
                            errors={errors}
                            touched={touched}
                            type="number"
                        />
                        <CustomInput
                            id="addRoom"
                            name="addRoom"
                            placeholder="Add Room (e.g., Deluxe, Executive, Suite)"
                            value={values.addRoom}
                            onChange={(e) => setFieldValue("addRoom", e.target.value)}
                            errors={errors}
                            touched={touched}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddRoom(setFieldValue, values.addRoom);
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <div className="bg-white p-4 rounded shadow">
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Room Type</th>
                                    <th className="border px-4 py-2">No. of Room</th>
                                    <th className="border px-4 py-2">Room Size(sq. ft.)</th>
                                    <th className="border px-4 py-2">Max Adults Allowed(12+yr)</th>
                                    <th className="border px-4 py-2">Max Children Allowed(0-12yr)</th>
                                    <th className="border px-4 py-2">Total Pax Allowed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomTypes.map((room, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{room.type}</td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`rooms[${index}].rooms`}
                                                placeholder="No. of Rooms"
                                                type="number"
                                                className="border p-1"
                                            />
                                            <ErrorMessage name={`rooms[${index}].rooms`} component="div" className="text-red-500" />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`rooms[${index}].size`}
                                                placeholder="Room Size"
                                                className="border p-1"
                                            />
                                            <ErrorMessage name={`rooms[${index}].size`} component="div" className="text-red-500" />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`rooms[${index}].adults`}
                                                placeholder="Max Adults"
                                                type="number"
                                                className="border p-1"
                                            />
                                            <ErrorMessage name={`rooms[${index}].adults`} component="div" className="text-red-500" />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`rooms[${index}].children`}
                                                placeholder="Max Children"
                                                type="number"
                                                className="border p-1"
                                            />
                                            <ErrorMessage name={`rooms[${index}].children`} component="div" className="text-red-500" />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`rooms[${index}].pax`}
                                                placeholder="Total Pax"
                                                type="number"
                                                className="border p-1"
                                            />
                                            <ErrorMessage name={`rooms[${index}].pax`} component="div" className="text-red-500" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {errors.rooms && touched.rooms && (
                            <div className="text-red-500">
                                {Array.isArray(errors.rooms) ? (
                                    <></>
                                ) : (
                                    <div>{errors.rooms}</div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mb-4 pt-6">
                        <label className="mr-2 font-medium text-gray-700 mb-4 ">Select Meal Types:</label>
                        <div>
                            {['EPAI', 'CPAI', 'MAPAI', 'APAI'].map(mealType => (
                                <button
                                    key={mealType}
                                    type="button"
                                    onClick={() => handleMealTypeChange(mealType)}
                                    className={`mr-4 ${selectedMealTypes.includes(mealType) ? 'btn btn-success bg-blue-500 text-white' : 'btn btn-warning bg-gray-200'}`}
                                >
                                    {mealType}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mr-2 font-medium text-gray-700 mb-4 ">Select Pricing Plan:</label>
                        <select className='bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            onChange={handlePlanChange} value={selectedPlan}>
                            <option value="ANNUAL">ANNUAL</option>
                            <option value="QUARTERLY">QUARTERLY</option>
                        </select>
                        {showQuarterPlan && (
                            <select
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5'
                                value={quarterPlan}
                                onChange={handleQuarterPlanChange}
                            >
                                <option value="Jan-Mar">Q1 (Jan-Mar)</option>
                                <option value="Apr-Jun">Q2 (Apr-Jun)</option>
                                <option value="Jul-Sep">Q3 (Jul-Sep)</option>
                                <option value="Oct-Dec">Q4 (Oct-Dec)</option>
                            </select>
                        )}
                    </div>

                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h4 className="text-xl font-semibold mb-4">{selectedPlan} Pricing {quarterPlan}</h4>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Room Type</th>
                                        {selectedMealTypes.map(mealType => (
                                            <React.Fragment key={mealType}>
                                                <th className="border px-4 py-2">{mealType} Single</th>
                                                <th className="border px-4 py-2">{mealType} Double</th>
                                                <th className="border px-4-py-2">{mealType} Extra Bed</th>
                                                <th className="border px-4 py-2">{mealType} Child 5-12</th>
                                                <th className="border px-4 py-2">{mealType} CNB</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {roomTypes.map(roomType => (
                                        <tr key={roomType.type}>
                                            <td className="border px-4 py-2">{roomType.type}</td>
                                            {selectedMealTypes.map(mealType => (
                                                <React.Fragment key={`${roomType.type}-${mealType}`}>
                                                    {['single', 'double', 'extraBed', 'child', 'noChild'].map((fieldType) => (
                                                        <td key={`${roomType.type}-${mealType}-${fieldType}`} className="border px-4 py-2">
                                                            <Field
                                                                name={`pricing.${selectedPlan}.${roomType.type}.${mealType}_based_Price.${fieldType}`}
                                                            >
                                                                {({ field }) => (
                                                                    <input
                                                                        {...field}
                                                                        type="number"
                                                                        className="border p-1 w-full"
                                                                        onChange={(e) => {
                                                                            // Update Formik's values directly
                                                                            field.onChange(e);
                                                                            // Update local state if needed
                                                                            handlePricingChange(
                                                                                roomType.type,
                                                                                mealType,
                                                                                fieldType,
                                                                                e.target.value
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </td>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mr-2 font-medium text-gray-700 mb-4">Select Blackout Dates:</label>
                        <select
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-50 p-2.5'
                            value={selectedBlackoutType}
                            onChange={(e) => setSelectedBlackoutType(e.target.value)}
                        >
                            <option value="RANGE">Range</option>
                            <option value="DATE">Custom Date</option>
                        </select>

                        <div className="mt-2">
                            {selectedBlackoutType === 'RANGE' && (
                                <DateRangePicker
                                    onApply={(e, picker) => handleDateRangeChange(picker.startDate, picker.endDate)}
                                >
                                    <button type="button" className="btn btn-primary m-2">
                                        Select Date Range
                                    </button>
                                </DateRangePicker>
                            )}

                            {selectedBlackoutType === 'DATE' && (
                                <DatePicker
                                    multiple
                                    value={dates}
                                    onChange={handleDateRangeCustomChange}
                                    onClose={handleDateSelectionComplete}
                                    render={(value, openCalendar) => (
                                        <button
                                            type="button"
                                            className="btn btn-primary m-2"
                                            onClick={() => {
                                                setDates([]);
                                                setTimeout(() => {
                                                    openCalendar();
                                                }, 0);
                                            }}
                                        >
                                            Select Custom Dates
                                        </button>
                                    )}
                                />
                            )}
                        </div>

                        {blackoutDates.map((blackout, index) => (
                            <div key={index} className="mt-4 p-4 border rounded">
                                <h4 className="text-lg font-semibold mb-2">
                                    Blackout Date Set #{index + 1} ({blackout.type})
                                </h4>
                                <p className="mb-2">{blackout.display}</p>

                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Room Type</th>
                                            {selectedMealTypes.map(mealType => (
                                                <React.Fragment key={mealType}>
                                                    <th className="border px-4 py-2">{mealType} Single</th>
                                                    <th className="border px-4 py-2">{mealType} Double</th>
                                                    <th className="border px-4-py-2">{mealType} Extra Bed</th>
                                                    <th className="border px-4 py-2">{mealType} Child 5-12</th>
                                                    <th className="border px-4 py-2">{mealType} CNB</th>
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomTypes.map(roomType => (
                                            <tr key={roomType.type}>
                                                <td className="border px-4 py-2">{roomType.type}</td>
                                                {selectedMealTypes.map(mealType => (
                                                    <React.Fragment key={mealType}>
                                                        {['single', 'double', 'extraBed', 'child', 'noChild'].map((field) => (
                                                            <td className="border px-4 py-2" key={`${mealType}-${field}`}>
                                                                <Field
                                                                    name={`blackoutDates.${index}.${roomType.type}.${mealType}.${field}`}
                                                                    type="number"
                                                                    className="w-full p-1 border"
                                                                />
                                                            </td>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h4 className="text-xl font-semibold mb-4 text-center">Add-Ons and Supplement Section</h4>
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Supplement</th>
                                    <th className="border px-4 py-2">Price</th>
                                    <th className="border px-4 py-2">Max Price</th>
                                    <th className="border px-4 py-2">Per Persons</th>
                                    <th className="border px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplements.map((supplement, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{supplement.name}</td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`supplements[${index}].price`}
                                                type="number"
                                                className="border p-1 w-full"
                                                value={supplement.price}
                                                onChange={e => {
                                                    const newSupplements = [...supplements];
                                                    newSupplements[index].price = e.target.value;
                                                    setSupplements(newSupplements);
                                                    setFieldValue(`supplements[${index}].price`, e.target.value);
                                                }}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`supplements[${index}].maxPrice`}
                                                type="number"
                                                className="border p-1 w-full"
                                                value={supplement.maxPrice}
                                                onChange={e => {
                                                    const newSupplements = [...supplements];
                                                    newSupplements[index].maxPrice = e.target.value;
                                                    setSupplements(newSupplements);
                                                    setFieldValue(`supplements[${index}].maxPrice`, e.target.value);
                                                }}
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <Field
                                                name={`supplements[${index}].persons`}
                                                type="number"
                                                className="border p-1 w-full"
                                                value={supplement.persons}
                                                onChange={e => {
                                                    const newSupplements = [...supplements];
                                                    newSupplements[index].persons = e.target.value;
                                                    setSupplements(newSupplements);
                                                    setFieldValue(`supplements[${index}].persons`, e.target.value);
                                                }}
                                            />
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSupplement(index)}
                                                className="text-red-500 hover:text-red-700 font-bold text-xl"
                                            >
                                                ✘
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {isAddingSupplement && (
                                    <tr>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                value={newSupplementName}
                                                onChange={(e) => setNewSupplementName(e.target.value)}
                                                placeholder="Supplement Name"
                                                className="border p-1 w-full"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                value={newSupplementPrice}
                                                onChange={(e) => setNewSupplementPrice(e.target.value)}
                                                placeholder="Price"
                                                className="border p-1 w-full"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                value={newSupplementMaxPrice}
                                                onChange={(e) => setNewSupplementMaxPrice(e.target.value)}
                                                placeholder="Max Price"
                                                className="border p-1 w-full"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                value={newSupplementPersons}
                                                onChange={(e) => setNewSupplementPersons(e.target.value)}
                                                placeholder="Persons"
                                                className="border p-1 w-full"
                                            />
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingSupplement(false)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                                                >
                                                    ✘
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddSupplement(setFieldValue)}
                                                    className="text-green-500 hover:text-green-700 font-bold text-xl"
                                                >
                                                    ✓
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <button
                                type="button"
                                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                                onClick={() => setIsAddingSupplement(!isAddingSupplement)}
                            >
                                {isAddingSupplement ? 'Cancel' : 'Add Supplement'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h3 className="text-lg font-medium mb-4">Room Images</h3>
                        {roomTypes.map((room, index) => (
                            <div key={index} className="mb-4">
                                <h4 className="text-lg font-medium mb-2">{room.type} Images</h4>
                                <div className="flex flex-wrap">
                                    {allImages[room.type] && allImages[room.type].map((imageData, imgIndex) => (
                                        <div key={imgIndex} className="relative mr-2 mb-2">
                                            <img src={imageData} alt={`${room.type} ${imgIndex + 1}`} className="w-32 h-32 object-cover rounded" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(room.type, imgIndex)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Upload Images</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(room.type, e)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-4 rounded shadow mb-4">
                        <h3 className="font-medium text-gray-700 mb-4 text-center">Room Amenities</h3>
                        <table className="table-auto w-full">
                            <thead>
                                <tr style={{ backgroundColor: "gray" }}>
                                    <th className="border px-4 py-2 text-center text-white">Category</th>
                                    <th className="border px-4 py-2 text-center text-white">Amenities</th>
                                    <th className="border px-4 py-2 text-center text-white">Room Types</th>
                                </tr>
                            </thead>
                            <tbody>
                                {amenities.map((mainCategory, mainIndex) => (
                                    <React.Fragment key={mainIndex}>
                                        <tr>
                                            <td className="border px-4 py-2 font-bold bg-gray-100" colSpan="3">
                                                <div className="flex justify-between items-center">
                                                    {mainCategory.name}
                                                    {mainCategory.name !== 'Others' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleAddSubcategory(mainIndex)}
                                                                className="p-1 bg-blue-500 text-white rounded"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {mainCategory.name !== 'Others' && mainCategory.isAdding && (
                                            <tr>
                                                <td className="border px-4 py-2" colSpan="3">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={newSubcategory}
                                                            onChange={(e) => setNewSubcategory(e.target.value)}
                                                            placeholder="Enter new subcategory"
                                                            className="flex-1 p-2 border rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1 bg-green-500 text-white rounded-md"
                                                            onClick={() => handleAddSubcategory(mainIndex)}
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {mainCategory.subcategories.map((subcategory, subIndex) => (
                                            <tr key={`${mainIndex}-${subIndex}`}>
                                                <td className="border px-4 py-2"></td>
                                                <td className="border px-4 py-2">
                                                    <div className="flex items-center justify-between">
                                                        {subcategory.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteSubcategory(mainIndex, subIndex)}
                                                            className="text-red-500 hover:text-red-700 ml-2"
                                                        >
                                                            ✘
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="border px-4 py-2 flex flex-wrap">
                                                    {roomTypes.map((roomType) => (
                                                        <div key={roomType.type} className="flex items-center mr-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={subcategory.selected.includes(roomType.type)}
                                                                onChange={() => handleCheckboxChange(mainIndex, subIndex, roomType.type)}
                                                                className="w-4 h-4 text-blue-600"
                                                            />
                                                            <span className="ml-2">{roomType.type}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                        {mainCategory.name === 'Others' && (
                                            <tr>
                                                <td className="border px-4 py-2" colSpan="3">
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={customAmenity}
                                                            onChange={(e) => setCustomAmenity(e.target.value)}
                                                            placeholder="Enter custom amenity"
                                                            className="flex-1 p-2 border rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                                            onClick={() => handleAddCustomAmenity(mainIndex)}
                                                        >
                                                            Add Custom Amenity
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Submit
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default Room;