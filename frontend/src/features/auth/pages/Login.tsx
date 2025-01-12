import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../stores/useAuthStore";

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      navigate("/", { replace: true });
      login(data);
    },
  });

  const validationSchema = Yup.object().shape({
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
  });

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validateOnChange={true}
        validateOnBlur={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const { email, password } = values;
            resetForm();
            mutation.mutate({
              email,
              password,
            });
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {({ touched, errors }) => (
          <div className="mt-40 flex h-[40vh] w-full items-center justify-center md:h-[60vh]">
            <Form className="flex w-full max-w-screen-sm flex-col px-12 py-8 md:mx-10 md:py-14 md:shadow-aesthetic">
              <h2 className="text-center text-2xl">Welcome Back!</h2>
              <p className="mb-10 text-center">Please enter your details</p>

              <Field
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                className={`mb-4 rounded border p-3 focus:outline-secondary ${touched.email && errors.email ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                component={"div"}
                name="email"
                className="-mt-3 ml-2 text-xs text-red-700"
              />

              <Field
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                className={`mb-4 rounded border p-3 focus:outline-secondary ${touched.password && errors.password ? "border-red-500" : ""}`}
              />
              <ErrorMessage
                component={"div"}
                name="password"
                className="-mt-3 ml-2 text-xs text-red-700"
              />

              {mutation.isError && (
                <div className="-mt-3 ml-2 text-xs text-red-700">
                  {mutation.error.message}
                </div>
              )}

              <button
                type="submit"
                className="mt-10 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base"
              >
                Log in
              </button>
              <hr className="my-4 border-t-2" />
              <button className="flex items-center justify-center rounded border-2 bg-white p-2 py-2 hover:scale-105 active:scale-110 active:opacity-95">
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
              </button>
              <div className="mt-4 text-center text-xs text-accent">
                need an account?
                <span className="ml-1 underline">
                  <Link to={"/signup"}>Create an account</Link>
                </span>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Login;
