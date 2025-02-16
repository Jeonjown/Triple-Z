import Login from "../../auth/pages/Login";
import useAuthStore from "../../auth/stores/useAuthStore";
import MultiStepForm from "../components/MultiStepForm";

const Schedule = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Login text="Please login first" destination="/schedule" />;
  }

  return (
    <>
      <MultiStepForm />
    </>
  );
};

export default Schedule;
