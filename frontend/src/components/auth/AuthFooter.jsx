import { Link } from "react-router-dom";

import {
    GREEN,
    TEXT_MUTED,
} from "../../utils/constants";

function AuthFooter({
    question,
    linkText,
    linkTo,
}) {
    return (
        <footer
            className="
                mt-3
                pt-3
                text-center
            "
        >
            <p
                className="
                    text-sm
                "
                style={{
                    color: TEXT_MUTED,
                }}
            >
                {question}{" "}

                <Link
                    to={linkTo}
                    className="
                        font-semibold
                        transition-colors
                        duration-200
                        hover:underline
                    "
                    style={{
                        color: GREEN,
                    }}
                >
                    {linkText}
                </Link>

            </p>

        </footer>
    );
}

export default AuthFooter;