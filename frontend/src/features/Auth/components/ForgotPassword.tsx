// pages/ForgotPassword.tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming your Shadcn button is here, adjust the path

const ForgotPassword = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, // Adjust the API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError(null);
      } else {
        setError(data.message || "Something went wrong.");
        setMessage(null);
      }
    } catch (err: any) {
      setError(err.message || "Network error occurred.");
      setMessage(null);
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="mb-4 w-full max-w-md rounded border-2 bg-white px-8 pb-8 pt-6 shadow-md">
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-700">
          Forgot Your Password?
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                  id="email"
                />
                <ErrorMessage
                  component="p"
                  name="email"
                  className="text-xs italic text-red-500"
                />
              </div>

              <Button type="submit">Send Reset Link</Button>

              {message && (
                <div className="mt-4 text-center text-green-500">{message}</div>
              )}
              {error && (
                <div className="mt-4 text-center text-red-500">{error}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
