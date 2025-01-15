import Login from "../../auth/pages/Login";
import useAuthStore from "../../auth/stores/useAuthStore";
import ReservationForm from "../components/ReservationForm";

const Schedule = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {isAuthenticated ? (
        <>
          <ReservationForm />
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
