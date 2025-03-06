import useGetReservations from "@/features/Events/hooks/useGetEventReservations";
import LoadingPage from "@/pages/LoadingPage";
import { columns, Reservation } from "./columns";
import { DataTable } from "./data-table";

const EventReservationsTable = () => {
  // Default data to an object with reservations as an empty array, matching our expected type.
  const { data = { message: "", reservations: [] }, isPending } =
    useGetReservations() as {
      data: { message: string; reservations: Reservation[] };
      isPending: boolean;
    };

  // Now data always has a reservations property.
  const eventReservations = data.reservations;

  if (isPending) {
    return <LoadingPage />;
  }
  return (
    <>
      <DataTable columns={columns} data={eventReservations} />
    </>
  );
};

export default EventReservationsTable;
