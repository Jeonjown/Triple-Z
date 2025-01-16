import { SetStateAction, useState } from "react";

type StepProps = {
  nextStep: () => void;
  prevStep: () => void;
};

const Step2 = ({ prevStep, nextStep }: StepProps) => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedAdditional, setSelectedAdditional] = useState("");
  const handleSelectedPackage = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedPackage(e.target.value);
  };

  const handleSelectedAdditional = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedAdditional(e.target.value);
  };
  return (
    <>
      <label className="mb-2 mt-5">Package</label>
      <select
        className="block w-full rounded-md border px-6 py-2 focus:outline-none"
        onChange={handleSelectedPackage}
      >
        <option disabled selected>
          Select your food
        </option>
        <option>Merienda Budgetarian</option>
        <option>Light and Sweet Desert</option>
        <option>Cravings Satisfied Busog</option>
        <option>Heavy Arabian Meal</option>
      </select>

      <label className="mb-2 mt-5">Additionials</label>
      <select
        className="block w-full rounded-md border px-6 py-2 focus:outline-none"
        onChange={handleSelectedAdditional}
      >
        <option disabled selected>
          Select your food
        </option>
        <option>Extra Shawarma</option>
        <option>Beefy Burger</option>
        <option>Quesadilla</option>
        <option>Chicha Platter</option>
      </select>

      <p className="mb-2 mt-5">Pre Order</p>
      <div className="block w-full rounded-md border bg-[#F8F8F8] p-8">
        {selectedPackage && <div>{selectedPackage}</div>}
        {selectedAdditional && <div>{selectedAdditional}</div>}
      </div>

      <label className="mb-2 mt-5">Notes</label>
      <textarea
        className="block w-full rounded-md border p-10 focus:outline-none"
        placeholder="Special Request"
      ></textarea>

      <div className="mt-5 flex gap-4">
        <button
          onClick={prevStep}
          className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Step2;
