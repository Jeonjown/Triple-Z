type StepProps = {
  values: {
    fullName: string;
    phoneNumber: string;
    partySize: number;
    date: string;
    startTime: string;
    endTime: string;
    eventType: string;
  };

  nextStep: () => void;
  prevStep: () => void;
  submitForm: () => void;
};

const Step3 = ({ prevStep, nextStep, submitForm, values }: StepProps) => {
  const handleSubmit = () => {
    console.log("Form values: ", values);
    submitForm();
    nextStep();
  };

  function formatDate(date: string): string {
    // Ensure the input date is in the correct format: yyyy-mm-dd
    const [year, month, day] = date.split("-");

    // Return the formatted date as mm-dd-yyyy
    return `${month}-${day}-${year}`;
  }

  function militaryToStandard(militaryTime: string): string {
    // Split the military time into hours and minutes
    const [hourStr, minute] = militaryTime.split(":");

    // Convert hour to a number for comparison
    let hour: number = parseInt(hourStr);

    // Determine if it's AM or PM
    const ampm: string = hour >= 12 ? "PM" : "AM";

    // Convert hour to 12-hour format
    hour = hour % 12;
    hour = hour ? hour : 12; // If hour is 0 (midnight), convert to 12

    // Return the formatted standard time
    return `${hour}:${minute} ${ampm}`;
  }

  return (
    <>
      <div className="mt-5 rounded-sm border p-8">
        <div className="text-text">Full Name:</div>
        <div className="font-semibold">{values.fullName}</div>
        <div className="text-text">Phone Number:</div>
        <div className="font-semibold">{values.phoneNumber}</div>
        <div className="text-text">Event Type: </div>
        <div className="font-semibold">{values.eventType}</div>
        <div className="text-text">Party Size:</div>
        <div className="font-semibold"> {values.partySize} </div>
        <div className="text-text">Date:</div>
        <div className="font-semibold">{formatDate(values.date)}</div>

        <div className="text-text">Time:</div>
        {
          <div className="font-semibold">
            <span> {militaryToStandard(values.startTime)} - </span>
            <span> {militaryToStandard(values.endTime)}</span>
          </div>
        }
        <div className="text-text">Preorder List:</div>
        <div className="font-semibold">WALA MONA GOLO AKO &lt;3</div>
      </div>

      <div className="mt-5 flex gap-4">
        <button
          onClick={prevStep}
          className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
        >
          Checkout
        </button>
      </div>
    </>
  );
};

export default Step3;
