function AuthButton({
    children,
    onClick,
    style,
    type = "button",
    disabled = false,
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="w-full py-3.5 rounded-[10px] text-white text-[15px] font-bold mt-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={style}
        >
            {children}
        </button>
    );
}

export default AuthButton;