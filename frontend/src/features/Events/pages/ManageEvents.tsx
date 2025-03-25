import EventReservationsControlPanel from "@/app/tables/event-reservations/EventReservationsControlPanel";

const ManageEvents = () => {
  return (
    <div className="flex justify-center">
      <div className="w-auto min-w-96">
        <EventReservationsControlPanel />
      </div>
    </div>
  );
};

export default ManageEvents;
