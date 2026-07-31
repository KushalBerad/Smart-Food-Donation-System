import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { updateProfile } from "../../services/donorService";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });


  // Fetch Profile Data
 useEffect(() => {

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/v1/donor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(res.data); // ✅ yaha res available hai


      setFormData({

        fullName: res.data.profile.organizationName || "",

        phone: res.data.profile.userId?.phone || "",

        email: res.data.profile.userId?.email || "",

        address: res.data.profile.address || "",

      });


    } catch (error) {

      console.log(
        "Fetch Profile Error:",
        error.response?.data || error.message
      );

    }

  };


  fetchProfile();

}, []);


  const handleChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };



  const handleSave = async () => {

    try {

      const response = await updateProfile({

        organizationName: formData.fullName,
        address: formData.address,

      });


      console.log(response);


    

      alert("Profile updated successfully");

      setIsEditing(false);


    } catch (error) {

      console.log(
        "Profile Update Error:",
        error.response?.data || error.message
      );


      alert(
        error.response?.data?.message ||
        "Profile update failed"
      );

    }

  };



  return (

    <div className="w-full px-6 py-6 max-w-xl mx-auto">


      {/* Header */}
      <div className="flex items-center justify-between mb-1">

        <h1 className="text-xl font-bold text-green-600">
          Profile
        </h1>


        {!isEditing && (

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >

            <Pencil className="w-4 h-4" />

            Edit

          </button>

        )}

      </div>


      <p className="text-gray-500 text-sm mt-1 mb-5">
        View and update your profile information.
      </p>



      {/* Card */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white">


        {/* Full Name */}
        <div className="mb-5">

          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Full Name
          </label>


          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
          />

        </div>



        {/* Phone */}
        <div className="mb-5">

          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Phone Number
          </label>


          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
          />

        </div>



        {/* Email */}
        <div className="mb-5">

          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Email Address
          </label>


          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
          />

        </div>



        {/* Address */}
        <div className="mb-6">

          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Address
          </label>


          <textarea
            name="address"
            rows={2}
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
          />

        </div>




        {/* Buttons */}
        {isEditing && (

          <div className="border-t border-gray-200 pt-5 flex justify-end gap-3">


            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>


            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
            >
              Save Changes
            </button>


          </div>

        )}


      </div>


    </div>

  );

}