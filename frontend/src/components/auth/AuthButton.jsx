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
            className="
                w-full
                h-12
                rounded-xl
                text-white
                text-[15px]
                font-semibold
                mt-2
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:shadow-lg
                active:translate-y-0
                active:shadow-md
                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
                disabled:hover:shadow-none
            "
            style={{
                ...style,
                boxShadow:
                    "0 10px 25px rgba(22,163,74,0.22)",
            }}
        >
            {children}
        </button>
    );
}

export default AuthButton;