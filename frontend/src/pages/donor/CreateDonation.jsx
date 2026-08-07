import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const initialForm = {
  foodName: "",
  foodType: "",
  quantity: "",
  preparedDate: "",
  preparedTime: "",
  pickupAddress: "",
  pickupDate: "",
  pickupTime: "",
  notes: "",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10 transition";

const labelClass =
  "block text-sm font-medium text-gray-700 mb-1";


export default function CreateDonation() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        foodName: form.foodName,
        category: form.foodType,
        quantity: form.quantity,
        preparedAt: `${form.preparedDate}T${form.preparedTime}`,
        pickupAddress: form.pickupAddress,
        pickupTime: `${form.pickupDate}T${form.pickupTime}`,
        description: form.notes,
      };
      console.log("Payload:", payload);
      const response = await api.post("/donations/create", payload);


      alert(response.data.message || "Donation created successfully.");

      setForm(initialForm);

      navigate("/dashboard");
    } catch (error) {
      console.error("Full Error:", error);

      console.log("Response Data:", error.response?.data);
      console.log("Payload Sent:", payload);

      alert(
        error.response?.data?.message ||
        "Unable to create donation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">

      <div className="mx-auto max-w-6xl">

        {/* Back Button */}

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-4 inline-flex items-center text-sm font-medium text-[#16A34A] hover:underline"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-bold text-gray-900">
            Create Donation
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            Fill in the donation details below so verified NGOs can
            discover, request and collect your food safely.
          </p>

        </div>

        {/* Form */}

        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >

          {/* FOOD INFORMATION */}

          <section className="border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-5">

            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Food Information
            </h2>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

              {/* Food Name */}

              <div>

                <label className={labelClass}>
                  Food Name
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  name="foodName"
                  value={form.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Veg Biryani"
                  required
                  className={inputClass}
                />

              </div>

              {/* Food Type */}

              <div>

                <label className={labelClass}>
                  Food Type
                  <span className="text-red-500"> *</span>
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

              <div className="lg:col-span-1">

                <label className={labelClass}>
                  Quantity
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 20 Meals or 5 kg"
                  required
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-500">
                  Example: 20 Meals, 5 kg or 12 Food Packets.
                </p>

              </div>

            </div>

          </section>

          {/* SCHEDULE */}

          <section className="border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-5">
            {/* <section className="border-b border-gray-100 p-3 sm:p-8"> */}

            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Schedule
            </h2>

            <div className="grid gap-6 lg:grid-cols-2">

              <div>

                <label className={labelClass}>
                  Prepared Date &amp; Time
                  <span className="text-red-500"> *</span>
                </label>

                <div className="grid grid-cols-2 gap-3">

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

              <div>

                <label className={labelClass}>
                  Pickup Date &amp; Time
                  <span className="text-red-500"> *</span>
                </label>

                <div className="grid grid-cols-2 gap-3">

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

            </div>

          </section>

          {/* PICKUP INFORMATION */}

          <section className="border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-5">

            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Pickup Information
            </h2>

            <div className="space-y-4">

              <div>

                <label className={labelClass}>
                  Pickup Address
                  <span className="text-red-500"> *</span>
                </label>

                <textarea
                  name="pickupAddress"
                  value={form.pickupAddress}
                  onChange={handleChange}
                  placeholder="Enter complete pickup address"
                  rows={4}
                  required
                  className={`${inputClass} resize-none`}
                />

              </div>

            </div>

          </section>

          {/* ADDITIONAL INFORMATION */}

          <section className="border-b border-gray-100 px-6 py-5 sm:px-8 sm:py-5">

            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Additional Information
            </h2>

            <div>

              <label className={labelClass}>
                Additional Notes

                <span className="ml-2 text-xs font-normal text-gray-500">
                  (Optional)
                </span>

              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add any useful information for the NGO"
                rows={4}
                className={`${inputClass} resize-none`}
              />

            </div>

          </section>

          {/* Submit */}

          <div className="flex justify-end p-6 sm:px-8 sm:py-6">

            <button
              type="submit"
              disabled={loading}
              className="min-w-[190px] rounded-xl bg-[#16A34A] px-8 py-3 font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Donation..."
                : "Create Donation"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}