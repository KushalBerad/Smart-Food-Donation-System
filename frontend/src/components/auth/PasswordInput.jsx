import { Eye, EyeOff } from "lucide-react";

import {
    BG_ERROR,
    BORDER,
    BORDER_ERROR,
    ICON_MUTED,
    TEXT_DARK
} from "../../utils/constants";

function PasswordInput({
    Icon,
    placeholder,
    value,
    onChange,
    hasError,
    showPassword,
    onToggle,
}) {
    return (
        <div
            className="
                group
                flex
                items-center
                gap-3
                h-12
                rounded-xl
                px-4
                bg-white
                transition-all
                duration-200
                focus-within:border-green-500
                focus-within:ring-4
                focus-within:ring-green-100
            "
            style={{
                border: `1px solid ${hasError ? BORDER_ERROR : BORDER
                    }`,
                background: hasError ? BG_ERROR : "#FFFFFF",
                boxShadow: hasError
                    ? "none"
                    : "0 1px 2px rgba(0,0,0,.03)",
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
                type={showPassword ? "text" : "password"}
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

            <button
                type="button"
                onClick={onToggle}
                aria-label="Toggle password visibility"
                className="
    flex
    items-center
    justify-center
    p-1
    rounded-md
    text-gray-400
    hover:text-green-600
    hover:bg-green-50
    transition-all
    duration-200
"
            >
                {showPassword ? (
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
                )}
            </button>
        </div>
    );
}

export default PasswordInput;