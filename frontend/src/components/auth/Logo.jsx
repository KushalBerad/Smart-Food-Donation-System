function Logo({
    title,
    subtitle,
    gradientStyle,
    textDark,
    textMuted,
}) {
    return (
        <div className="flex items-center gap-2.5 mb-5">
            <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={gradientStyle}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                >
                    <path d="M12 2c-1.5 3-2 5-2 7a2 2 0 104 0c0-2-.5-4-2-7z" />
                    <path d="M6 13c0 4 2.5 8 6 8s6-4 6-8" />
                </svg>
            </div>

            <div>
                <div
                    className="font-bold text-[15px]"
                    style={{ color: textDark }}
                >
                    {title}
                </div>

                <div
                    className="text-xs"
                    style={{ color: textMuted }}
                >
                    {subtitle}
                </div>
            </div>
        </div>
    );
}

export default Logo;