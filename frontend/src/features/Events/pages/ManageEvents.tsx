import EventReservationsTable from "@/app/tables/event-reservations/page";

const ManageEvents = () => {
  return (
    <div className="flex justify-center">
      <div className="w-auto min-w-96">
        <EventReservationsTable />
      </div>
    </div>
  );
};

export default ManageEvents;
