import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
    label,
    name,
    value,
    placeholder,
    onChange,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="relative">
                <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-green-500"
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;