const AuthButton = ({
    children,
    loading = false,
    type = "button",
}) => {
    return (
        <button
            type={type}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition disabled:opacity-70"
        >
            {loading ? "Please wait..." : children}
        </button>
    );
};

export default AuthButton;