import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateFacilities } from '../../features/facilities/facalitiesSlice';
import { pdf } from '@react-pdf/renderer';
import HotelPdfDocument from '../HotelPdfDocument';

const Facilities = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { data, hotelData } = location.state || {};
  // console.log(data, hotelData)
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState({
    "Accommodation and Relaxation Facilities": ["Bed", "Living Room", "Fitness Center"],
    "Dining and Food Services": ["Restaurant", "Room Service", "Convenience Store"],
    "Business and Professional Services": ["Conference Room", "Business Center"],
    "Family and Kid-Friendly Services": ["Kids Play Area"],
    "Accessibility and Special Needs": ["Accessible Room", "In-House Medical Assistance"],
  });

  const [selectedFacilities, setSelectedFacilities] = useState({});
  const [rules, setRules] = useState([
    "Smoking Allowed",
    "Alcohol Allowed",
    "Pets Living in the Property",
    "Self-check-in via Smart Door",
    "Accessible to guests who use a wheelchair",
    "Private Parties and events Allowed",
  ]);

  const [newFacility, setNewFacility] = useState({});
  const [newAttraction, setNewAttraction] = useState({ name: "", distance: "" });
  const [newRule, setNewRule] = useState("");

  const toggleFacility = (category, item) => {
    setSelectedFacilities((prev) => {
      const updatedCategory = prev[category] ? prev[category] : [];
      const isSelected = updatedCategory.includes(item);
      if (isSelected) {
        return {
          ...prev,
          [category]: updatedCategory.filter((i) => i !== item),
        };
      } else {
        return {
          ...prev,
          [category]: [...updatedCategory, item],
        };
      }
    });
  };

  const addFacility = (category) => {
    if (newFacility[category]) {
      setFacilities((prev) => ({
        ...prev,
        [category]: [...prev[category], newFacility[category]],
      }));
      setNewFacility((prev) => ({ ...prev, [category]: "" }));
    }
  };

  const formik = useFormik({
    initialValues: {
      policies: {
        checkIn: "12:00",
        checkOut: "12:00",
        cancellationPolicy: "",
        groupPolicy: "",
      },
      rules: [],
      attractions: [
        { name: "Nearest Airport", distance: 10 },
        { name: "Nearest Railway Station", distance: 3 },
        { name: "Nearest Bus Stop", distance: 5 },
        { name: "City Centre", distance: 0.5 },
      ],
    },
    validationSchema: Yup.object({
      policies: Yup.object().shape({
        checkIn: Yup.string().required("Check-in time is required"),
        checkOut: Yup.string().required("Check-out time is required"),
      }),
    }),
    onSubmit: async (values) => {
      const hotelId = hotelData?._id || "67b588c5ea19439af183e469";

      const transformed = {
        "Accommodation_and_Relaxation_facilites": selectedFacilities["Accommodation and Relaxation Facilities"] || [],
        "Dining_and_Food_Services": selectedFacilities["Dining and Food Services"] || [],
        "Business_and_Professional_Services": selectedFacilities["Business and Professional Services"] || [],
        "Family_and_Kid_Friendly_Services": selectedFacilities["Family and Kid-Friendly Services"] || [],
        "Accessible_and_Special_Need": selectedFacilities["Accessibility and Special Needs"] || [],
      };
      const submittedValues = {
        policies: values.policies,
        Rules: values.rules,
        generalFacilities: transformed,
        nearbyAttractions: values.attractions,
      };

      console.log(submittedValues);
      const payload = {
        ...submittedValues,
      };
      const resultAction = await dispatch(updateFacilities({ hotelId, facilitiesData: payload }));

      if (updateFacilities.fulfilled.match(resultAction)) {
        await handleDownloadPdf(resultAction.payload)
        const successMessage = resultAction.payload.message || 'Facilities updated successfully!';
        toast.success(successMessage);
        navigate("/dashboard");
      } else {
        toast.error(resultAction.payload);
      }
    },
  });

  const handleDownloadPdf = async (facilitiesData) => {
    if (!facilitiesData || !data) {
      console.error("Missing required data for PDF generation.");
      return;
    }
    try {
      const blob = await pdf(
        <HotelPdfDocument
          roomInfo={data.getRoomsByHotelId}
          facilitiesInfo={facilitiesData.hotel}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hotel-details.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }


  const addAttraction = () => {
    if (newAttraction.name && newAttraction.distance) {
      formik.setFieldValue("attractions", [
        ...formik.values.attractions,
        { name: newAttraction.name, distance: parseFloat(newAttraction.distance) },
      ]);
      setNewAttraction({ name: "", distance: "" });
    }
  };

  const toggleRule = (rule) => {
    if (formik.values.rules.includes(rule)) {
      formik.setFieldValue("rules", formik.values.rules.filter((r) => r !== rule));
    } else {
      formik.setFieldValue("rules", [...formik.values.rules, rule]);
    }
  };

  const addRule = () => {
    if (newRule) {
      setRules((prev) => [...prev, newRule]);
      setNewRule("");
    }
  };

  return (
    <div className="p-20 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">General Facilities</h2>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(facilities).map((category, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg">{index + 1}. {category}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {facilities[category].map((item, idx) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 rounded ${selectedFacilities[category]?.includes(item) ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    onClick={() => toggleFacility(category, item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newFacility[category] || ""}
                  onChange={(e) => setNewFacility((prev) => ({ ...prev, [category]: e.target.value }))}
                  placeholder="Add new facility"
                  className="border p-1 rounded"
                />
                <button className="ml-2 bg-green-500 text-white px-3 py-1 rounded" onClick={() => addFacility(category)}>Add Facility</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Nearby Attractions and Facilities</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Near-By Attractions</th>
              <th className="border p-2">Distance(KM)</th>
            </tr>
          </thead>
          <tbody>
            {formik.values.attractions.map((attraction, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{attraction.name}</td>
                <td className="border p-2 text-center">
                  <input type="number" className="border p-1 w-full" value={attraction.distance} onChange={(e) => {
                    const updatedAttractions = [...formik.values.attractions];
                    updatedAttractions[index].distance = e.target.value;
                    formik.setFieldValue("attractions", updatedAttractions);
                  }} />
                </td>
              </tr>
            ))}
            <tr>
              <td className="border p-2">
                <input
                  type="text"
                  value={newAttraction.name}
                  onChange={(e) => setNewAttraction({ ...newAttraction, name: e.target.value })}
                  placeholder="Attraction Name"
                  className="border p-1 rounded"
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={newAttraction.distance}
                  onChange={(e) => setNewAttraction({ ...newAttraction, distance: e.target.value })}
                  placeholder="Distance (KM)"
                  className="border p-1 w-full"
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-center">
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={addAttraction}>Add Attraction</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bg-white shadow-md p-6 rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Standard Policies and House Rules</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Check-in</label>
            <input type="time" name="policies.checkIn" className="w-full p-2 border rounded" value={formik.values.policies.checkIn} onChange={formik.handleChange} />
          </div>
          <div>
            <label className="block font-semibold">Check-Out</label>
            <input type="time" name="policies.checkOut" className="w-full p-2 border rounded" value={formik.values.policies.checkOut} onChange={formik.handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="">Cancellation Policy</label>
            <textarea name="policies.cancellationPolicy" className="w-full p-2 border rounded" onChange={formik.handleChange} value={formik.values.policies.cancellationPolicy}></textarea>
          </div>
          <div>
            <label className="">Group Policy</label>
            <textarea name="policies.groupPolicy" className="w-full p-2 border rounded" onChange={formik.handleChange} value={formik.values.policies.groupPolicy}></textarea>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Rules</h2>
        <div className="grid grid-cols-3 gap-2">
          {rules.map((rule, index) => (
            <button key={index} className={`px-3 py-1 rounded ${formik.values.rules.includes(rule) ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => toggleRule(rule)}>
              {rule}
            </button>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Add new rule"
            className="border p-1 rounded"
          />
          <button className="ml-2 bg-green-500 text-white px-3 py-1 rounded" onClick={addRule}>Add Rule</button>
        </div>
      </div>

      <button className="mt-6 bg-green-500 text-white px-4 py-2 rounded" onClick={formik.handleSubmit}>Submit</button>
    </div>
  );
};

export default Facilities;
