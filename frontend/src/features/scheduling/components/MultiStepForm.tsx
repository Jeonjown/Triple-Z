import * as Yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { useState } from "react";

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required."),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone Number must be exactly 11 digits")
      .required("Phone Number is required"),
    partySize: Yup.number()
      .min(12, "Party size must be at least 12")
      .required("Party Size is required"),
    date: Yup.date()
      .min(new Date(), "Date cannot be in the past")
      .required("Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string()
      .required("End Time is required")
      .test(
        "isAfterStartTime",
        "End Time must be after Start Time",
        function (value) {
          const { startTime } = this.parent; // Access other fields in the same object
          return !startTime || value > startTime; // Ensure endTime is after startTime
        },
      ),
    eventType: Yup.string().required("Event Type is required"),
  });

  const initialValues = {
    fullName: "",
    phoneNumber: "",
    partySize: 12,
    date: "",
    startTime: "",
    endTime: "",
    eventType: "",
  };

  const handleSubmit = (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ) => {
    console.log("Form Submitted:", values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, touched, errors, submitForm }) => (
        <div className="mt-15 flex w-full items-center justify-center md:mt-16">
          <Form className="flex w-full max-w-screen-sm flex-col px-12 py-8 md:mx-10 md:py-14 md:shadow-aesthetic">
            {currentStep !== 4 && (
              <>
                <h2 className="mb text-center font-heading text-2xl">
                  Make a Reservation
                </h2>
                <p className="text-center">
                  Select your details and we'll try get the best seats for you
                </p>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h2 className="mb text-center text-4xl">
                  Thank you for your reservation!
                </h2>
              </>
            )}

            <div className="text-sm">
              {currentStep === 1 && <span className="text-gray-400">Date</span>}
              {currentStep === 2 && (
                <span className="text-gray-400">
                  Date &gt; Menu Pre-Order &gt;
                </span>
              )}
              {currentStep === 3 && (
                <span className="text-gray-400">
                  Date &gt; Menu Pre-Order &gt; Confirmation
                </span>
              )}
              {currentStep === 4 && (
                <span className="text-gray-400">
                  Date &gt; Menu Pre-Order &gt; Confirmation &gt; Checkout
                </span>
              )}
            </div>
            {currentStep === 1 && (
              <Step1 nextStep={nextStep} touched={touched} errors={errors} />
            )}
            {currentStep === 2 && (
              <Step2 prevStep={prevStep} nextStep={nextStep} />
            )}
            {currentStep === 3 && (
              <Step3
                prevStep={prevStep}
                nextStep={nextStep}
                values={values}
                submitForm={submitForm}
              />
            )}
            {currentStep === 4 && <Step4 />}
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default MultiStepForm;
