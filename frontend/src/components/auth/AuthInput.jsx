import {
    BG_ERROR,
    BORDER,
    BORDER_ERROR,
    ICON_MUTED,
    INPUT_BG,
    TEXT_DARK,
} from "../../utils/constants";

function AuthInput({
    Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    hasError,
}) {
    return (
        <div
            className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
            style={{
                background: hasError ? BG_ERROR : INPUT_BG,
                border: `1px solid ${hasError ? BORDER_ERROR : BORDER}`,
            }}
        >
            <Icon
                size={16}
                color={ICON_MUTED}
                className="shrink-0"
            />

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm"
                style={{ color: TEXT_DARK }}
            />
        </div>
    );
}

export default AuthInput;