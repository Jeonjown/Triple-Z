import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({
  message = "Something went wrong. Please try again.",
  statusCode,
}: {
  message?: string;
  statusCode?: number;
}) => {
  const navigate = useNavigate();

  // Auto-handle specific errors
  useEffect(() => {
    if (statusCode === 401) {
      navigate("/login"); // Redirect to login if unauthorized
    }
  }, [statusCode, navigate]);

  // Custom messages for known errors
  const errorMessages: Record<number, string> = {
    400: "Bad Request. Please check your input.",
    401: "Unauthorized. Please log in.",
    403: "Forbidden. You don't have permission.",
    404: "Page not found.",
    500: "Internal server error. Try again later.",
  };

  return (
    <div className="flex h-screen w-full -translate-y-24 flex-col items-center justify-center">
      <div className="relative">
        <h1 className="mt-2 text-9xl font-bold tracking-wide text-primary">
          {statusCode || "Error"}
        </h1>
        <img
          src="/error coffee.svg"
          alt="Loading..."
          className="absolute left-[3.8rem] top-8 w-32"
        />
      </div>

      <p className="tex-text mt-4 text-xl">
        <span className="text-xl text-text">Oops! </span>
        {errorMessages[statusCode || 0]}
      </p>
      <p>{message}</p>
      <div className="mt-10 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.reload()}
          className="hover:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
