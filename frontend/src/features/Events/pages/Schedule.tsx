import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { RadioGroup } from "@radix-ui/react-radio-group";
import Login from "../../Auth/pages/Login";
import useAuthStore from "../../Auth/stores/useAuthStore";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import EventForm from "./EventForm";
import GroupForm from "./GroupForm";

const Schedule = () => {
  const { user } = useAuthStore();

  const navigate = useNavigate(); // Initialize navigate function

  // Initialize state with an empty string or a default value
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Handle navigation when the option changes
  const handleSelection = (value: string) => {
    setSelectedOption(value);
    if (value === "Events") {
      navigate(`/schedule/event-form/${user?._id}`); // Pass userId in the URL
    } else if (value === "Groups") {
      navigate(`/schedule/group-form/${user?._id}`); // Pass userId in the URL
    }
  };

  if (!user) {
    return <Login text="Please login first" destination="/schedule" />;
  }

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center text-center">
        <h2 className="font-heading text-2xl">Choose Event Type</h2>
        <RadioGroup
          defaultValue="option-one"
          onValueChange={handleSelection} // Call handleSelection when value changes
          className="mt-2 flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Groups" id="Groups" />
            <Label htmlFor="Groups">Groups</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Events" id="Events" />
            <Label htmlFor="Events">Events</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Conditionally render forms */}
      {selectedOption === "Events" ? (
        <EventForm />
      ) : selectedOption === "Groups" ? (
        <GroupForm />
      ) : null}
    </>
  );
};

export default Schedule;
