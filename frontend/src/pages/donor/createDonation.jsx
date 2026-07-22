import axios from "axios";
import { useState } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function CreateDonation() {
  const [form, setForm] = useState({
    foodName: "",
    foodType: "",
    quantity: "",
    preparedDate: "",
    preparedTime: "",
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    notes: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const donationData = {
      foodName: form.foodName,
      category: form.foodType,
      quantity: form.quantity,
      preparedAt: form.preparedDate,
      pickupAddress: form.pickupAddress,
      pickupTime: form.pickupTime,
      description: form.notes,
    };

    const response = await axios.post(
      "http://localhost:5000/api/v1/donations/create",
      donationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Donation created:", response.data);
    alert("Donation created successfully!");

  } catch (error) {
    console.error("Error:", error);
    alert(
      error.response?.data?.message ||
      "Failed to create donation"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Back link */}
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Donation</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Fill in the details of the food you want to donate.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Food Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Veg Biryani"
                value={form.foodName}
                onChange={handleChange("foodName")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Food Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.foodType}
                onChange={handleChange("foodType")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="">Select food type</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 20 Meals / 5 Kg"
                value={form.quantity}
                onChange={handleChange("quantity")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Prepared Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Prepared Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="dd-mm-yyyy"
                    value={form.preparedDate}
                    onChange={handleChange("preparedDate")}
                    className="w-full rounded-lg border border-gray-300 pl-4 pr-9 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="hh:mm AM/PM"
                    value={form.preparedTime}
                    onChange={handleChange("preparedTime")}
                    className="w-full rounded-lg border border-gray-300 pl-4 pr-9 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <Clock
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Pickup Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pickup Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Enter full address"
                value={form.pickupAddress}
                onChange={handleChange("pickupAddress")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Pickup Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pickup Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="dd-mm-yyyy"
                    value={form.pickupDate}
                    onChange={handleChange("pickupDate")}
                    className="w-full rounded-lg border border-gray-300 pl-4 pr-9 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <Calendar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="hh:mm AM/PM"
                    value={form.pickupTime}
                    onChange={handleChange("pickupTime")}
                    className="w-full rounded-lg border border-gray-300 pl-4 pr-9 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <Clock
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any other useful information for the NGO"
                value={form.notes}
                onChange={handleChange("notes")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Submit button - centered, green (reference: image 2) */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-10 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Submit Donation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
