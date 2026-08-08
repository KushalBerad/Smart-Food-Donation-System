import { PlusCircle } from "lucide-react";

export default function DashboardHeader({
    title,
    userName,
    buttonText = "Create Donation",
    onCreateDonation,
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">

            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {title}
                </h1>

                <p className="mt-2 text-base text-gray-500">
                    Welcome back,&nbsp;

                    <span className="font-semibold text-gray-900">
                        {userName}
                    </span>

                    . Here's an overview of your donations.
                </p>
            </div>

            {onCreateDonation && (
                <button
                    type="button"
                    onClick={onCreateDonation}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
                >
                    <PlusCircle size={18} />

                    {buttonText}
                </button>
            )}

        </div>
    );
}