import { useEffect, useState } from "react";
import { getDonorHistory, getHistoryById } from "../../services/donationService";

const statusStyles = {
  completed: "bg-green-100 text-green-700",
  accepted: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatStatus = (status) => (status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A");

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

const formatTime = (date) =>
  date ? new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "N/A";

function Detail({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-medium text-sm text-gray-800 text-right">{value || "N/A"}</span>
    </div>
  );
}

function DetailModal({ record, onClose }) {
  if (!record) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">History Details</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        <div className="p-6">
          <Detail label="Food Name" value={record.foodName} />
          <Detail label="NGO Name" value={record.ngoName} />
          <Detail label="NGO City" value={record.ngoCity} />
          <Detail label="Status" value={formatStatus(record.status)} />
          <Detail label="Quantity" value={record.quantity} />
          <Detail label="Requested Quantity" value={record.requestedQuantity} />
          <Detail label="Date" value={formatDate(record.date)} />
          <Detail label="Time" value={formatTime(record.date)} />
          <Detail label="Message" value={record.message} />
          <Detail label="Rating" value={record.rating ? `${record.rating}/5` : "N/A"} />
          <Detail label="Feedback" value={record.feedback} />
        </div>
        <div className="p-5">
          <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getDonorHistory(activeTab, currentPage, 10);
      console.log("History API Response:", res);
      if (res.success) {
        setHistory(res.data);
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [activeTab, currentPage]);

  return (
    <div className="w-full">
      <div className="mb-6 ml-6 mt-6">
        <h1 className="text-2xl font-bold text-green-600">History</h1>
        <p className="text-gray-500 mt-1">View your donation and request history.</p>
      </div>

      <div className="flex border-b bg-white">
        {["all", "donation", "request"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={`px-6 py-4 font-semibold capitalize border-b-2 transition ${
              activeTab === tab ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-green-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-4 text-left">Type</th>
              <th className="px-5 py-4 text-left">Food</th>
              <th className="px-5 py-4 text-left">NGO</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-left">Date</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-10 text-gray-500">No History Found</td></tr>
            ) : (
              history.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-4 capitalize">{item.type}</td>
                  <td className="px-5 py-4">{item.foodName}</td>
                  <td className="px-5 py-4">{item.ngoName}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status] || "bg-gray-100 text-gray-700"}`}>
                      {formatStatus(item.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div>{formatDate(item.date)}</div>
                    <div className="text-xs text-gray-400">{formatTime(item.date)}</div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={async () => {
                        try {
                          const res = await getHistoryById(item._id);
                          if (res.success) setSelectedRecord(res.data);
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                      className="text-sky-600 font-semibold hover:text-sky-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-3 mt-5">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50">
          Next
        </button>
      </div>

      <DetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}
