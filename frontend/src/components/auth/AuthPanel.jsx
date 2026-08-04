function AuthPanel({ children }) {
    return (
        <section
            className="
                h-screen
                overflow-y-auto
                bg-white
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-[720px]
                    px-8
                    py-12
                    lg:px-16
                    lg:py-14
                "
            >
                {children}
            </div>
        </section>
    );
}

export default AuthPanel;