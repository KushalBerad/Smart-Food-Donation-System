import { useEffect, useState } from "react";
import { getPendingRequests, respondToRequest } from "../../services/donationService";

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await getPendingRequests();
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const res = await respondToRequest(id, action);
      if (res.success) {
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="p-6 md:p-8 bg-gray-50 min-h-screen">

    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#16A34A]">
        Manage Requests
      </h1>

      <p className="text-gray-500 mt-2">
        Review and respond to food requests from NGOs.
      </p>
    </div>

    {/* Card */}
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-green-50 border-b border-green-200">
            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">
                NGO Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">
                Donation
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">
                Requested Quantity
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">
                Requested On
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-green-700">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="5"
                  className="py-16 text-center text-[#16A34A] font-medium"
                >
                  Loading Requests...
                </td>
              </tr>

            ) : requests.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="py-16 text-center text-gray-500"
                >
                  No Pending Requests Found
                </td>
              </tr>

            ) : (

              requests.map((req) => (

                <tr
                  key={req._id}
                  className="border-b border-gray-100 hover:bg-green-50 transition"
                >

                  <td className="px-6 py-5">
                    <p className="font-semibold text-gray-800">
                      {req.ngoName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {req.ngoCity}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-800">
                      {req.foodName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {req.quantity}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-gray-700 font-medium">
                    {req.requestedQuantity}
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-gray-700">
                      {req.requestedDate}
                    </p>

                    <p className="text-sm text-gray-500">
                      {req.requestedTime}
                    </p>
                  </td>

                  <td className="px-6 py-5">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          handleAction(req._id, "accept")
                        }
                        className="px-5 py-2 rounded-lg bg-[#16A34A] text-white text-sm font-medium hover:bg-green-700 transition"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleAction(req._id, "reject")
                        }
                        className="px-5 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition"
                      >
                        Reject
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>
      </div>

    </div>

  </div>
);
}