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
                setError("");
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

                const storedUser = JSON.parse(
                    localStorage.getItem("user") || "{}"
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        ...storedUser,
                        ...data.data,
                    })
                );

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
            <div className="flex flex-1 min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={32}
                        className="animate-spin text-[#16A34A]"
                    />
                    <p className="text-sm text-black-500">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    {/* Left */}
                    <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A]/10">
                            <User
                                size={30}
                                className="text-[#16A34A]"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-black-900">
                                {profile?.name}
                            </h1>
                            <p className="mt-1 text-sm text-black-500">
                                Donor Account
                            </p>
                            <p className="mt-1 text-sm text-[#16A34A] font-medium">
                                {profile?.city || "City not added"}
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="rounded-xl bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D]"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setForm(profile);
                                }}
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-black-700 transition hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D]"
                            >

                                {saving ? (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={16} />
                                )}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-medium text-red-600">{error}</div>}
            {success && <div className="bg-[#16A34A]/10 border border-[#16A34A]/20 rounded-xl px-4 py-3 text-sm font-medium text-[#16A34A]">{success}</div>}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {fields.map(({ key, label, icon: Icon, readOnly }) => (
                    <div
                        key={key}
                        className={`
                            border
                            rounded-2xl
                            bg-white
                            border-gray-200
                            shadow-sm
                            transition
                            hover:border-[#16A34A]/40
                            hover:shadow-md
                            ${key === "address" ? "md:col-span-2" : ""}
                            p-5
                            `}
                    >
                        <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black-500">
                            <Icon size={14} />
                            {label}
                        </label>
                        {editMode && !readOnly ? (
                            key === "address" ? (
                                <textarea
                                    rows={3}
                                    required
                                    value={form[key] || ""}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            [key]: e.target.value,
                                        }))
                                    }
                                    className="
                                    resize-none
                                    rounded-xl
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-[#16A34A]
                                    focus:ring-2
                                    focus:ring-[#16A34A]/10
                                    w-full
                                "
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={form[key] || ""}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            [key]: e.target.value,
                                        }))
                                    }
                                    className="
                                    rounded-xl
                                    border
                                    border-gray-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-[#16A34A]
                                    focus:ring-2
                                    focus:ring-[#16A34A]/10
                                    w-full
                                "
                                />
                            )
                        ) : (
                            <p
                                className="
                                rounded-xl
                                border
                                border-gray-100
                                bg-gray-50
                                px-4
                                py-3
                                text-sm
                                text-black-800
                                whitespace-pre-line
                                min-h-[48px]
                            "
                            >
                                {profile?.[key] || "—"}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
