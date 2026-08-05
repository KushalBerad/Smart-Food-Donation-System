import { CheckCircle } from "lucide-react";

const steps = [
  { key: "available", label: "Available" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "picked_up", label: "Picked Up" },
  { key: "completed", label: "Completed" },
];

export default function DonationStatusTracker({
  status = "available",
}) {
  const currentStep = steps.findIndex(
    (step) => step.key === status?.toLowerCase()
  );

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Donation Progress
      </h2>

      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center min-w-[82px]">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${
                      completed
                        ? "bg-green-600 border-green-600 text-white"
                        : active
                        ? "bg-blue-600 border-blue-600 text-white shadow-md"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                >
                  {completed || active ? (
                    <CheckCircle size={20} />
                  ) : (
                    <span className="text-sm font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>

                <p
                  className={`mt-2.5 text-sm font-medium text-center whitespace-nowrap
                    ${
                      completed
                        ? "text-green-600"
                        : active
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                >
                  {step.label}
                </p>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full
                    ${
                      index < currentStep
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}