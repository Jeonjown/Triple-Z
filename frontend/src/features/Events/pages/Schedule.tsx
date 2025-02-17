import { useState } from "react";
import { RadioGroup } from "@radix-ui/react-radio-group";
import Login from "../../Auth/pages/Login";
import useAuthStore from "../../Auth/stores/useAuthStore";

import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import EventForm from "./EventForm";
import GroupForm from "./GroupForm";

const Schedule = () => {
  const { user } = useAuthStore();

  // Initialize state with an empty string or a default value
  const [selectedOption, setSelectedOption] = useState<string>("");

  if (!user) {
    return <Login text="Please login first" destination="/schedule" />;
  }

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center text-center">
        <h2 className="font-heading text-2xl">Choose Event Type</h2>
        <RadioGroup
          defaultValue="option-one"
          onValueChange={setSelectedOption}
          className="mt-2 flex items-center space-x-2"
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

      {selectedOption && selectedOption === "Events" ? (
        <EventForm />
      ) : (
        <GroupForm />
      )}
    </>
  );
};

export default Schedule;
