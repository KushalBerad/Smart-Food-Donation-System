function AuthLayout({ children, pageBg, border }) {
    return (
        <div
            className="min-h-screen w-full flex justify-center px-4 py-8"
            style={{ background: pageBg }}
        >
            <div
                className="w-full max-w-[530px] bg-white rounded-2xl shadow-sm px-7 pt-6 pb-8"
                style={{
                    border: `1px solid ${border}`,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;