interface ProgressBarProps {
  currentStep: number;
  steps: { step: number; label: string }[];
}

export const ProgressBar = ({
  currentStep,
  steps,
}: ProgressBarProps): JSX.Element => {
  // Calculate progress percentage based on the current step and total steps
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-10 mt-10 w-full">
      {/* Progress Bar */}
      <div className="relative m-auto h-1 w-[95%] rounded-full bg-gray-200">
        <div
          className="h-1 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }} // Dynamic calculation
        ></div>
      </div>

      {/* Milestone Circles and Labels */}
      <div className="absolute -top-3 left-[5px] flex w-full justify-between">
        {steps.map(({ step, label }) => (
          <div key={step} className="flex flex-col items-center">
            {/* Milestone Circle */}
            <div
              className={`h-8 w-8 rounded-full border-2 ${
                currentStep >= step
                  ? "border-primary bg-primary"
                  : "bg-gray-200"
              } flex items-center justify-center text-sm font-semibold text-white`}
            >
              {step}
            </div>
            {/* Label */}
            <div className="mt-2 text-xs font-medium text-gray-600">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
