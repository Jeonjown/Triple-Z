import Login from "../../auth/pages/Login";
import useAuthStore from "../../auth/stores/useAuthStore";
import MultiStepForm from "../components/MultiStepForm";

const Schedule = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated ? (
        <>
          <MultiStepForm />
        </>
      ) : (
        <div>
          <h1>Login First: </h1>
          <Login />
        </div>
      )}
    </>
  );
};

export default Schedule;
