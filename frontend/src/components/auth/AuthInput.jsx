import {
    BG_ERROR,
    BORDER,
    BORDER_ERROR,
    ICON_MUTED,
    TEXT_DARK
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
            className="
group
flex
items-center
gap-3
rounded-xl
px-4
h-12
transition-all
duration-200
bg-white
focus-within:border-green-500
focus-within:ring-4
focus-within:ring-green-100
"
            style={{
                border: `1px solid ${hasError ? BORDER_ERROR : BORDER
                    }`,
                background: hasError ? BG_ERROR : "#FFFFFF",
            }}
        >
            <Icon
                size={18}
                color={ICON_MUTED}
                className="
                    shrink-0
                    transition-colors
                    duration-200
                    group-focus-within:text-green-600
                "
            />

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="
                    flex-1
                    bg-transparent
                    outline-none
                    text-[15px]
                    placeholder:text-gray-400
                "
                style={{
                    color: TEXT_DARK,
                }}
            />
        </div>
    );
}

export default AuthInput;