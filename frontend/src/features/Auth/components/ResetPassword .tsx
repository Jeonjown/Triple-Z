import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming your Shadcn button is here, adjust the path
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError("Invalid reset link.");
    }
  }, [searchParams]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(/[@$!%*?&]/, "Must contain at least one special character")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm new password is required"),
  });

  const handleSubmit = async (values: { password: string }) => {
    if (!token || !email) {
      setError("Invalid reset link.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            email,
            password: values.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError(null);
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after successful reset
        }, 1500);
      } else {
        setError(data.message || "Something went wrong.");
        setMessage(null);
      }
    } catch (err: any) {
      setError(err.message || "Network error occurred.");
      setMessage(null);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="mb-4 w-full max-w-md rounded bg-white px-8 pb-8 pt-6 shadow-md">
          <h2 className="mb-6 text-center text-xl font-semibold text-gray-700">
            Reset Password
          </h2>
          <p className="mb-4 text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="mb-4 w-full max-w-md rounded border-2 bg-white px-8 pb-8 pt-6 shadow-md">
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-700">
          Reset Your Password
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Enter your new password below.
        </p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  New Password
                </label>
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  placeholder="Enter new password"
                  className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    touched.password && errors.password ? "border-red-500" : ""
                  }`}
                  id="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <ErrorMessage
                  component="p"
                  name="password"
                  className="text-xs italic text-red-500"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-bold text-gray-700"
                >
                  Confirm New Password
                </label>
                <Field
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                  placeholder="Confirm new password"
                  className={`focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                  id="confirmPassword"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                <ErrorMessage
                  component="p"
                  name="confirmPassword"
                  className="text-xs italic text-red-500"
                />
              </div>

              <Button type="submit">Reset Password</Button>

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

export default ResetPassword;
