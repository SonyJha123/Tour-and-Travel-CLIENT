import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CreatableSelect from 'react-select/creatable';
import CustomInput from '../../Components/CustomInput';
import PhoneInput from 'react-phone-input-2';
import { Country, State, City } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createHotel, setBasicInformation, setContactInformation } from '../../features/hotel/hotelSlice';


const BasicInfo = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [propertyTypes, setPropertyTypes] = useState([
        { value: 'hotel', label: 'Hotel' },
        { value: 'apartments', label: 'Apartments' },
        { value: 'villa', label: 'Villa' },
        { value: 'resort', label: 'Resort' },
        { value: 'resort_hotel', label: 'Hotel and Resort' },
    ]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);


    const handleDeletePhone = (fieldName, index, values, setFieldValue) => {
        const currentPhones = [...values[fieldName]];
        currentPhones.splice(index, 1);
        setFieldValue(fieldName, currentPhones);
    };

    const validationSchema = Yup.object().shape({
        hotelName: Yup.string()
            .required('Hotel Name is required')
            .min(3, 'Hotel Name must be at least 3 characters')
            .max(100, 'Hotel Name must be less than 100 characters'),
        propertyType: Yup.string().required('Property Type is required'),
        address: Yup.string()
            .required('Address is required')
            .min(10, 'Address must be at least 10 characters')
            .max(255, 'Address must be less than 255 characters'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        zipCode: Yup.string()
            .required('Zip/Postal Code is required')
            .min(5, 'Zip/Postal Code must be at least 5 characters')
            .max(10, 'Zip/Postal Code must be less than 10 characters'),
        description: Yup.string()
            .required('Description is required')
            .min(20, 'Description must be at least 20 characters')
            .max(500, 'Description must be less than 500 characters'),
        salesEmail: Yup.string().email('Invalid email format').required('Sales Email is required'),
        salesPhones: Yup.array().of(
            Yup.string()
                .required('Sales Phone number is required')
                .matches(/^\+?[0-9]{10,15}$/, 'Sales Phone number is not valid')
        ).min(1, 'At least one phone number is required'),
        operationEmail: Yup.string().email('Invalid email format').required('Operation Email is required'),
        operationPhones: Yup.array().of(
            Yup.string()
                .required('Operation Phone number is required')
                .matches(/^\+?[0-9]{10,15}$/, 'Operation Phone number is not valid')
        ).min(1, 'At least one phone number is required'),
        frontOfficeEmail: Yup.string().email('Invalid email format').required('Front Office Email is required'),
        frontOfficePhones: Yup.array().of(
            Yup.string()
                .required('Front Office Phone number is required')
                .matches(/^\+?[0-9]{10,15}$/, 'Front Office Phone number is not valid')
        ).min(1, 'At least one phone number is required'),
        managementEmail: Yup.string().email('Invalid email format').required('Management Email is required'),
        managementPhones: Yup.array().of(
            Yup.string()
                .required('Management Phone number is required')
                .matches(/^\+?[0-9]{10,15}$/, 'Management Phone number is not valid')
        ).min(1, 'At least one phone number is required'),
        rating: Yup.number()
            .required('Rating is required')
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5'),
        website: Yup.string().url('Invalid website format'),
    });

    return (
        <section className="BasicInfoSec mt-[40px] py-10">
            <div className="max-w-screen-xl mx-auto">
                <Formik
                    initialValues={{
                        hotelName: '',
                        propertyType: '',
                        address: '',
                        city: '',
                        state: '',
                        country: '',
                        zipCode: '',
                        description: '',
                        salesEmail: '',
                        salesPhones: [''],
                        operationEmail: '',
                        operationPhones: [''],
                        frontOfficeEmail: '',
                        frontOfficePhones: [''],
                        managementEmail: '',
                        managementPhones: [''],
                        rating: 0,
                        website: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        const payload = {
                            basicInformation: {
                                name: values.hotelName,
                                propertyType: values.propertyType,
                                description: values.description,
                                category: values.rating.toString(),
                                location: {
                                    address: values.address,
                                    city: values.city,
                                    state: values.state,
                                    country: values.country,
                                    zipCode: values.zipCode,
                                }
                            },
                            contactInformation: {
                                sales_team: {
                                    email: values.salesEmail,
                                    phone: values.salesPhones
                                },
                                operation_team: {
                                    email: values.operationEmail,
                                    phone: values.operationPhones
                                },
                                management_team: {
                                    email: values.managementEmail,
                                    phone: values.managementPhones
                                },
                                front_office_team: {
                                    email: values.frontOfficeEmail,
                                    phone: values.frontOfficePhones
                                },
                                website: values.website
                            },
                        };
                        dispatch(setBasicInformation(payload.basicInformation));
                        dispatch(setContactInformation(payload.contactInformation));

                        const resultAction = await dispatch(createHotel(payload));

                        if (createHotel.fulfilled.match(resultAction)) {
                            const successMessage = resultAction.payload.message || 'Hotel created successfully!';
                            toast.success(successMessage);
                            navigate('/room', { state: resultAction.payload });
                        } else {
                            toast(resultAction.payload);
                        }

                    }}
                >
                    {({ setFieldValue, errors, touched, values }) => (
                        <Form>
                            {/* Basic Information Section */}
                            <div className="bg-pink-50 p-6 rounded-md shadow-md space-y-4">
                                <h1 className="text-[28px] font-bold text-gray-900">Basic Information</h1>
                                <CustomInput
                                    id="hotelName"
                                    name="hotelName"
                                    placeholder="Enter Property Name"
                                    errors={errors}
                                    touched={touched}
                                />
                                <div>
                                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                                    <CreatableSelect
                                        isClearable
                                        id="propertyType"
                                        name="propertyType"
                                        options={propertyTypes}
                                        onChange={(selectedOption) => {
                                            setFieldValue('propertyType', selectedOption ? selectedOption.label : '');
                                            // if (selectedOption && selectedOption.label) {
                                            //     setPropertyTypes((prevTypes) => [...prevTypes,selectedOption]);
                                            // }
                                        }}

                                        // onCreateOption={(newValue) => {
                                        //     const newOption = { value: newValue, label: newValue };
                                        //     setPropertyTypes((prevTypes) => [...prevTypes, newOption]);
                                        //     setFieldValue('propertyType', newOption.value);
                                        // }}
                                        isSearchable={false}
                                        className={`mt-1 ${errors.propertyType && touched.propertyType ? 'border-red-500' : ''}`}
                                    />
                                    <ErrorMessage name="propertyType" component="div" className="text-red-500 text-sm" />
                                </div>

                                {/* Rating Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={star <= values.rating ? "#FFD700" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="w-6 h-6 cursor-pointer"
                                                onClick={() => setFieldValue('rating', star)}
                                            >
                                                <path
                                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                    fill={star <= values.rating ? "#FFD700" : "none"}
                                                    stroke={star <= values.rating ? "none" : "#FFD700"}
                                                />
                                            </svg>
                                        ))}
                                    </div>
                                    <ErrorMessage name="rating" component="div" className="text-red-500 text-sm" />
                                </div>

                                <CustomInput
                                    id="address"
                                    name="address"
                                    placeholder="Enter Address"
                                    errors={errors}
                                    touched={touched}
                                    bgColor="bg-white"
                                />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                                        <select
                                            id="country"
                                            name="country"
                                            onChange={(e) => {
                                                const selectedCountry = e.target.value;
                                                setFieldValue('country', selectedCountry);
                                                setStates(State.getStatesOfCountry(selectedCountry));
                                                setFieldValue('state', '');
                                                setFieldValue('city', '');
                                            }}
                                            className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${errors.country && touched.country ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select Country</option>
                                            {Country.getAllCountries().map((country) => (
                                                <option key={country.isoCode} value={country.isoCode}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ErrorMessage name="country" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                                        <select
                                            id="state"
                                            name="state"
                                            onChange={(e) => {
                                                const selectedState = e.target.value;
                                                setFieldValue('state', selectedState);
                                                setCities(City.getCitiesOfState(values.country, selectedState));
                                                setFieldValue('city', '');
                                            }}
                                            className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${errors.state && touched.state ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state.isoCode} value={state.isoCode}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                        <select
                                            id="city"
                                            name="city"
                                            onChange={(e) => setFieldValue('city', e.target.value)}
                                            className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${errors.city && touched.city ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city) => (
                                                <option key={city.id} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                    </div>

                                    <div>
                                        <CustomInput
                                            id="zipCode"
                                            name="zipCode"
                                            placeholder="Enter Zip/Postal Code"
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                </div>

                                <CustomInput
                                    as="textarea"
                                    id="description"
                                    name="description"
                                    placeholder="Enter Description"
                                    rows="4"
                                    errors={errors}
                                    touched={touched}
                                    bgColor="bg-white"
                                />
                            </div>
                            {/* Contact Information section */}
                            <div className="bg-white-100 p-6 rounded-md shadow-md mt-8 space-y-4">
                                <h2 className="text-[28px] font-bold text-gray-900">Contact Information</h2>
                                {/* Sales Team */}
                                <h4 className="font-bold mt-6">Sales Team:</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <CustomInput
                                        id="salesEmail"
                                        name="salesEmail"
                                        placeholder="Enter Sales Email"
                                        errors={errors}
                                        touched={touched}
                                        bgColor="bg-gray-200"
                                    />
                                    {values.salesPhones.map((phone, index) => (
                                        <div key={index} className="relative">
                                            <PhoneInput
                                                country={'in'}
                                                value={phone}
                                                onChange={(value) => {
                                                    const updatedPhones = [...values.salesPhones];
                                                    updatedPhones[index] = value;
                                                    setFieldValue('salesPhones', updatedPhones);
                                                }}
                                                inputClass={`mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-200 ${errors.salesPhones && touched.salesPhones ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {values.salesPhones.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhone('salesPhones', index, values, setFieldValue)}
                                                    className="absolute right-2 top-9 text-red-500 hover:text-red-700"
                                                >
                                                  ✘
                                                </button>
                                            )}
                                            <ErrorMessage name={`salesPhones[${index}]`} component="div" className="text-red-500 text-sm" />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFieldValue('salesPhones', [...values.salesPhones, ''])}
                                        className='underline text-blue-500 text-sm'
                                    >
                                        + Add Another Phone Number
                                    </button>
                                </div>
                                {/* Operation Team */}
                                <h4 className="font-bold mt-6">Operation Team:</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <CustomInput
                                        id="operationEmail"
                                        name="operationEmail"
                                        placeholder="Enter Operation Email"
                                        errors={errors}
                                        touched={touched}
                                        bgColor="bg-gray-200"
                                    />
                                    {values.operationPhones.map((phone, index) => (
                                        <div key={index} className="relative">
                                            <PhoneInput
                                                country={'in'}
                                                value={phone}
                                                onChange={(value) => {
                                                    const updatedPhones = [...values.operationPhones];
                                                    updatedPhones[index] = value;
                                                    setFieldValue('operationPhones', updatedPhones);
                                                }}
                                                inputClass={`mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-200 ${errors.operationPhones && touched.operationPhones ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {values.operationPhones.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhone('operationPhones', index, values, setFieldValue)}
                                                    className="absolute right-2 top-9 text-red-500 hover:text-red-700"
                                                >
                                                  ✘
                                                </button>
                                            )}
                                            <ErrorMessage name={`operationPhones[${index}]`} component="div" className="text-red-500 text-sm" />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFieldValue('operationPhones', [...values.operationPhones, ''])}
                                        className='underline text-blue-500 text-sm'
                                    >
                                        + Add Another Phone Number
                                    </button>
                                </div>
                                {/* Front Office Team */}
                                <h4 className="font-bold mt-6">Front Office Team:</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <CustomInput
                                        id="frontOfficeEmail"
                                        name="frontOfficeEmail"
                                        placeholder="Enter Front Office Email"
                                        errors={errors}
                                        touched={touched}
                                        bgColor="bg-gray-200"
                                    />
                                    {values.frontOfficePhones.map((phone, index) => (
                                        <div key={index} className="relative">
                                            <PhoneInput
                                                country={'in'}
                                                value={phone}
                                                onChange={(value) => {
                                                    const updatedPhones = [...values.frontOfficePhones];
                                                    updatedPhones[index] = value;
                                                    setFieldValue('frontOfficePhones', updatedPhones);
                                                }}
                                                inputClass={`mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-200 ${errors.frontOfficePhones && touched.frontOfficePhones ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {values.frontOfficePhones.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhone('frontOfficePhones', index, values, setFieldValue)}
                                                    className="absolute right-2 top-9 text-red-500 hover:text-red-700"
                                                >
                                                  ✘
                                                </button>
                                            )}
                                            <ErrorMessage name={`frontOfficePhones[${index}]`} component="div" className="text-red-500 text-sm" />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFieldValue('frontOfficePhones', [...values.frontOfficePhones, ''])}
                                        className='underline text-blue-500 text-sm'
                                    >
                                        + Add Another Phone Number
                                    </button>
                                </div>
                                {/* Management Team */}
                                <h4 className="font-bold mt-6">Management Team:</h4>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <CustomInput
                                        id="managementEmail"
                                        name="managementEmail"
                                        placeholder="Enter Management Email"
                                        errors={errors}
                                        touched={touched}
                                        bgColor="bg-gray-200"
                                    />
                                    {values.managementPhones.map((phone, index) => (
                                        <div key={index} className="relative">
                                            <PhoneInput
                                                country={'in'}
                                                value={phone}
                                                onChange={(value) => {
                                                    const updatedPhones = [...values.managementPhones];
                                                    updatedPhones[index] = value;
                                                    setFieldValue('managementPhones', updatedPhones);
                                                }}
                                                inputClass={`mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-200 ${errors.managementPhones && touched.managementPhones ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {values.managementPhones.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePhone('managementPhones', index, values, setFieldValue)}
                                                    className="absolute right-2 top-9 text-red-500 hover:text-red-700"
                                                >
                                                  ✘
                                                </button>
                                            )}
                                            <ErrorMessage name={`managementPhones[${index}]`} component="div" className="text-red-500 text-sm" />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setFieldValue('managementPhones', [...values.managementPhones, ''])}
                                        className='underline text-blue-500 text-sm'
                                    >
                                        + Add Another Phone Number
                                    </button>
                                </div>
                                {/* Website Field */}
                                <div>
                                    <CustomInput
                                        id="website"
                                        name="website"
                                        placeholder="Enter Website URL"
                                        errors={errors}
                                        touched={touched}
                                        bgColor="bg-gray-200"
                                    />
                                </div>

                                <div className="flex gap-3 justify-end py-3">
                                    <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Save</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </section>
    );
};

export default BasicInfo;
