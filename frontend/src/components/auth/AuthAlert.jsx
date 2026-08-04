import {
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

function AuthAlert({
    type = "error",
    message,
}) {
    if (!message) return null;

    const isSuccess = type === "success";

    return (
        <div
            className={`
                mb-6
                flex
                items-start
                gap-3
                rounded-2xl
                border
                px-4
                py-3
            `}
            style={{
                background: isSuccess
                    ? "#ECFDF3"
                    : "#FEF2F2",

                borderColor: isSuccess
                    ? "#A7F3D0"
                    : "#FECACA",
            }}
        >
            {isSuccess ? (
                <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                />
            ) : (
                <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-500"
                />
            )}

            <p
                className="text-sm leading-6"
                style={{
                    color: isSuccess
                        ? "#166534"
                        : "#B91C1C",
                }}
            >
                {message}
            </p>
        </div>
    );
}

export default AuthAlert;