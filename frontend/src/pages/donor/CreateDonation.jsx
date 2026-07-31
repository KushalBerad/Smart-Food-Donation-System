import { useState } from "react";
import { createDonation } from "../../services/donationService";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const donationData = {
      foodName: form.foodName,
      category: form.foodType,
      quantity: form.quantity,

      preparedAt: new Date(
        `${form.preparedDate}T${form.preparedTime}`
      ).toISOString(),

      expiryAt: new Date(
        new Date(`${form.preparedDate}T${form.preparedTime}`).getTime() +
        24 * 60 * 60 * 1000
      ).toISOString(),

      pickupAddress: form.pickupAddress,

      pickupTime: new Date(
        `${form.pickupDate}T${form.pickupTime}`
      ).toISOString(),

      description: form.notes,
    };

    const res = await createDonation(donationData);

    console.log("Donation Created:", res);

    alert("Donation Created Successfully!");

    setForm({
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
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message || "Failed to create donation"
    );
  }
};

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-4 sm:py-8 font-sans">
      <div className="max-w-xl mx-auto">

        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-semibold text-green-600 tracking-tight">
          Create Donation
        </h1>

        <p className="text-sm font-normal text-gray-500 mt-1 mb-4">
          Fill in the details of the food you want to donate.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6 space-y-4"
        >
          {/* Food Name */}
          <div>
            <label className={labelClass}>
              Food Name *
            </label>

            <input
              type="text"
              name="foodName"
              value={form.foodName}
              onChange={handleChange}
              placeholder="e.g., Veg Biryani"
              required
              className={inputClass}
            />
          </div>

          {/* Food Type */}
          <div>
            <label className={labelClass}>
              Food Type *
            </label>

            <select
              name="foodType"
              value={form.foodType}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select food type</option>
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
              <option value="bakery">Bakery</option>
              <option value="packaged">Packaged Food</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className={labelClass}>
              Quantity *
            </label>

            <input
              type="text"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g., 20 Meals / 5 Kg"
              required
              className={inputClass}
            />
          </div>

          {/* Prepared Time */}
          <div>
            <label className={labelClass}>
              Prepared Time *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="date"
                name="preparedDate"
                value={form.preparedDate}
                onChange={handleChange}
                required
                className={inputClass}
              />

              <input
                type="time"
                name="preparedTime"
                value={form.preparedTime}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className={labelClass}>
              Pickup Address *
            </label>

            <textarea
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              placeholder="Enter full address"
              rows="2"
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label className={labelClass}>
              Pickup Time *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="date"
                name="pickupDate"
                value={form.pickupDate}
                onChange={handleChange}
                required
                className={inputClass}
              />

              <input
                type="time"
                name="pickupTime"
                value={form.pickupTime}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>
              Additional Notes (Optional)
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any other useful information for the NGO"
              rows="2"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-1">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 active:bg-green-800 transition shadow-sm"
            >
              Submit Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}