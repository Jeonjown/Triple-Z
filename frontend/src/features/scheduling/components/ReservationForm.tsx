import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import EventCalendar from "./EventCalendar";

const ReservationForm = () => {
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
      {({ touched, errors }) => (
        <div className="mt-15 flex w-full items-center justify-center md:mt-16">
          <Form className="flex w-full max-w-screen-sm flex-col px-12 py-8 md:mx-10 md:py-14 md:shadow-aesthetic">
            <div>
              <h2 className="text-center font-heading text-2xl">
                Make a Reservation
              </h2>
              <p className="mb-10 text-center">
                Select your details and we'll try get the best seats for you
              </p>
              <label htmlFor="fullName" className="block">
                Full Name
              </label>
              <Field
                type="text"
                id="fullName"
                name="fullName"
                className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.fullName && errors.fullName ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="-mt-3 text-xs text-red-700"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block">
                Phone Number
              </label>
              <Field
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.phoneNumber && errors.phoneNumber ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="-mt-3 text-xs text-red-700"
              />
            </div>
            <div>
              <label htmlFor="partySize" className="block">
                Party Size
              </label>
              <Field
                type="number"
                placeholder="minimum of 12"
                name="partySize"
                className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.partySize && errors.partySize ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                name="partySize"
                component="div"
                className="-mt-3 text-xs text-red-700"
              />
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <Field
                type="date"
                name="date"
                className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.date && errors.date ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                name="date"
                component="div"
                className="-mt-3 text-xs text-red-700"
              />
            </div>
            <div>
              <label htmlFor="startTime">Start Time</label>
              <Field
                type="time"
                name="startTime"
                className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.startTime && errors.startTime ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                name="startTime"
                component="div"
                className="-mt-3 text-xs text-red-700"
              />
            </div>
            <div>
              <label htmlFor="endTime">End Time</label>
              <Field
                type="time"
                name="endTime"
                className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.endTime && errors.endTime ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                name="endTime"
                component="div"
                className="-mt-3 text-xs text-red-700"
              />
            </div>
            <div>
              <label htmlFor="eventType">Event Type</label>
              <Field
                type="text"
                id="eventType"
                name="eventType"
                className={`mb-4 w-full rounded border p-3 focus:outline-secondary ${touched.eventType && errors.eventType ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                name="eventType"
                component="div"
                className="-mt-3 text-xs text-red-700"
              />
            </div>
            <EventCalendar />
            <div className="mt-5 flex gap-4">
              <button className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base">
                Previous
              </button>
              <button className="mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base">
                Next
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ReservationForm;
