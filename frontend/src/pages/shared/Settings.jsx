import { Bell, Globe, Mail, Moon, Save } from "lucide-react";
import { useState } from "react";

export default function Settings() {
    const [settings, setSettings] = useState({
        notifications: true,
        emailNotifications: true,
        theme: "light",
        language: "English",
    });

    const handleToggle = (field) => {
        setSettings((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        setSettings((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = () => {
        alert("Settings saved successfully.");
    };

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">

            {/* Header */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Settings
                </h1>

                <p className="mt-2 text-gray-500">
                    Manage your account preferences.
                </p>
            </div>

            {/* Preferences */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* Notifications */}

                <div className="flex justify-between items-center">

                    <div className="flex gap-3 items-center">
                        <Bell className="text-green-600" />
                        <div>
                            <p className="font-medium">
                                Push Notifications
                            </p>
                            <p className="text-sm text-gray-500">
                                Receive app notifications.
                            </p>
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={() => handleToggle("notifications")}
                        className="w-5 h-5 accent-green-600"
                    />

                </div>

                {/* Email */}

                <div className="flex justify-between items-center">

                    <div className="flex gap-3 items-center">
                        <Mail className="text-green-600" />
                        <div>
                            <p className="font-medium">
                                Email Notifications
                            </p>
                            <p className="text-sm text-gray-500">
                                Receive updates through email.
                            </p>
                        </div>
                    </div>

                    <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={() =>
                            handleToggle("emailNotifications")
                        }
                        className="w-5 h-5 accent-green-600"
                    />

                </div>

                {/* Theme */}

                <div>

                    <label className="flex items-center gap-2 font-medium mb-2">
                        <Moon size={18} />
                        Theme
                    </label>

                    <select
                        name="theme"
                        value={settings.theme}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                    >
                        <option value="light">Light</option>
                        <option value="dark" disabled>
                            Dark (Coming Soon)
                        </option>
                    </select>

                </div>

                {/* Language */}

                <div>

                    <label className="flex items-center gap-2 font-medium mb-2">
                        <Globe size={18} />
                        Language
                    </label>

                    <select
                        name="language"
                        value={settings.language}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                    >
                        <option>English</option>
                        {/* <option disabled>Hindi (Coming Soon)</option> */}
                        {/* <option disabled>Marathi (Coming Soon)</option> */}
                    </select>

                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
                >
                    <Save size={18} />
                    Save Changes
                </button>

            </div>

        </div>
    );
}