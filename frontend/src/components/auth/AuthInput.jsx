const AuthInput = ({
    label,
    type = "text",
    name,
    value,
    placeholder,
    onChange,
}) => {
    return (
        <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    );
};

export default AuthInput;