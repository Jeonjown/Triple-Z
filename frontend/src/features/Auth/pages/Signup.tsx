import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../stores/useAuthStore";
import { useState } from "react"; // Import useState
import { Eye, EyeOff } from "lucide-react"; // Import icons

const Signup = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      navigate("/", { replace: true });
      login(data);
    },
  });

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character",
      ) // At least one special character
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleGoogleLogin = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validateOnChange={true} // Validate on change
        validateOnBlur={true} // Validate on blur
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const { username, email, password, confirmPassword } = values;
            resetForm();
            mutation.mutate({ username, email, password, confirmPassword });
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {({ touched, errors }) => (
          <div className="mt-40 flex h-[40vh] w-full items-center justify-center md:h-[60vh]">
            <Form className="md:shadow-aesthetic flex w-full max-w-screen-sm flex-col px-12 py-8 md:mx-10 md:py-14">
              <h2 className="text-center text-2xl">Create an Account</h2>
              <p className="mb-10 text-center">Please enter your details</p>

              <Field
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                className={`mb-4 rounded border p-3 focus:outline-secondary ${
                  touched.username && errors.username ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                component={"div"}
                name="username"
                className="-mt-3 ml-2 text-xs text-red-700"
              />

              <Field
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                className={`mb-4 rounded border p-3 focus:outline-secondary ${
                  touched.email && errors.email ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                component={"div"}
                name="email"
                className="-mt-3 ml-2 text-xs text-red-700"
              />

              <div className="relative mb-4">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  placeholder="Password"
                  autoComplete="new-password"
                  className={`w-full rounded border p-3 focus:outline-secondary ${
                    touched.password && errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 cursor-pointer text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMessage
                component={"div"}
                name="password"
                className="-mt-3 ml-2 text-xs text-red-700"
              />
              <div className="relative mb-4">
                <Field
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                  placeholder="Confirm Password"
                  autoComplete="password"
                  className={`w-full rounded border p-3 focus:outline-secondary ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-4 cursor-pointer text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <ErrorMessage
                component={"div"}
                name="confirmPassword"
                className="-mt-3 ml-2 text-xs text-red-700"
              />

              {mutation.isError && (
                <div className="-mt-3 ml-2 text-xs text-red-700">
                  {mutation.error.message}
                </div>
              )}

              <button
                type="submit"
                className="mt-10 rounded bg-primary py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
              >
                Sign up
              </button>
              <hr className="my-4 border-t-2" />
              <a
                onClick={handleGoogleLogin}
                className="flex items-center justify-center rounded border-2 bg-white p-2 py-2 hover:scale-105 hover:cursor-pointer active:scale-110 active:opacity-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  className="mr-3 w-5"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                <p className="text-base">Sign up with Google</p>
              </a>
              {/* <span className="ml-1 underline">
                <Link to={"/signup"}>Create an account</Link>
              </span> */}
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Signup;
