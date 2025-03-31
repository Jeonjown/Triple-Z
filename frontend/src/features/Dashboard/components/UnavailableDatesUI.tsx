import { useGetUnavailableDates } from "@/features/Events/hooks/useGetUnavailableDates";
import { useMarkUnavailableDate } from "@/features/Events/hooks/useMarkUnavailableDate";
import { useUnmarkUnavailableDate } from "@/features/Events/hooks/useUnmarkUnavailableDate";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { X } from "lucide-react";
import { useState } from "react";

const UnavailableDatesUI = () => {
  const { data: unavailableDates, isLoading } = useGetUnavailableDates();
  const { mutate: markDate } = useMarkUnavailableDate();
  const { mutate: unmarkDate } = useUnmarkUnavailableDate();

  const [dateInput, setDateInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");

  const handleMarkDate = () => {
    if (!dateInput) {
      toast({
        title: "Error",
        description: "Please enter a date",
        variant: "destructive",
      });
      return;
    }
    markDate({ date: dateInput, reason: reasonInput });
    setDateInput("");
    setReasonInput("");
  };

  return (
    <div className="mx-auto mt-5 max-w-xl p-4">
      <h2 className="mb-4 text-xl font-bold">Mark Unavailable Dates</h2>
      <div className="mb-4 flex flex-col gap-2">
        <input
          type="date"
          className="rounded border p-2"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Reason (e.g., Maintenance day)"
          className="rounded border p-2"
          value={reasonInput}
          onChange={(e) => setReasonInput(e.target.value)}
        />
        <button
          onClick={handleMarkDate}
          className="rounded bg-primary p-2 text-white"
        >
          Mark Date as Unavailable
        </button>
      </div>

      <h3 className="mb-2 text-lg font-semibold">Unavailable Dates</h3>
      {isLoading ? (
        <p>Loading unavailable dates...</p>
      ) : (
        <ul className="space-y-2">
          {unavailableDates?.map((date) => (
            <li
              key={date._id}
              className="flex items-center justify-between rounded border p-2"
            >
              <div>
                <div className="font-bold">
                  {format(new Date(date.date), "PPP")}
                </div>
                <div className="text-sm text-gray-600">{date.reason}</div>
              </div>
              <button onClick={() => unmarkDate(date._id)}>
                <X className="h-5 w-5 text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnavailableDatesUI;
