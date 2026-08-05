import DonationStatusTracker from "../../components/DonationStatusTracker";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDonationDetails } from "../../services/ngoService";

export default function DonationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonation();
  }, []);

  const fetchDonation = async () => {
    try {
      setLoading(true);

      const data = await getDonationDetails(id);

      if (data.success) {
        setDonation(data.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load donation."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2
          size={32}
          className="animate-spin text-[#16A34A]"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">

      <button
        onClick={() => navigate(-1)}
        className="mb-5 text-green-600 font-medium hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Donation Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Food Name</p>
            <p className="font-semibold">
              {donation.foodName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-semibold capitalize">
              {donation.category}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="font-semibold">
              {donation.quantity}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Pickup Address
            </p>
            <p className="font-semibold">
              {donation.pickupAddress}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Pickup Time
            </p>
            <p className="font-semibold">
              {new Date(
                donation.pickupTime
              ).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Current Status
            </p>

            <span className="inline-flex rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold">
              {donation.status}
            </span>
          </div>

        </div>

        <DonationStatusTracker
          status={donation.status}
        />

      </div>

    </div>
  );
}