import {
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    getDonorProfile,
    updateDonorProfile,
} from "../../services/donorService";

export default function DonorProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const data = await getDonorProfile();
                if (data.success) {
                    setProfile(data.data);
                    setForm(data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");
            const data = await updateDonorProfile(form);
            if (data.success) {
                setProfile(data.data);
                setForm(data.data);
                setEditMode(false);
                setSuccess("Profile updated successfully");
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { key: "name", label: "Full Name", icon: User },
        { key: "phone", label: "Phone Number", icon: Phone },
        { key: "email", label: "Email Address", icon: Mail, readOnly: true },
        { key: "city", label: "City", icon: MapPin },
        { key: "address", label: "Address", icon: MapPin },
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 size={28} className="animate-spin text-[#16A34A]" />
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donor Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your Personal details</p>
                </div>
                {!editMode ? (
                    <button onClick={() => setEditMode(true)} className="px-4 py-2 text-sm font-medium text-white bg-[#16A34A] rounded-xl hover:bg-[#15803D] transition">
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => { setEditMode(false); setForm(profile); }} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#16A34A] rounded-xl hover:bg-[#15803D] transition disabled:opacity-60">
                            <Save size={14} />
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                )}
            </div>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>}
            {success && <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-xl p-3 text-sm text-[#16A34A]">{success}</div>}



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {fields.map(({ key, label, icon: Icon, readOnly }) => (
                    <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                            <Icon size={14} />
                            {label}
                        </label>
                        {editMode && !readOnly ? (
                            <input
                                type="text"
                                value={form[key] || ""}
                                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#16A34A] transition"
                            />
                        ) : (
                            <p className="text-sm text-gray-800 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                                {profile?.[key] || "—"}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
