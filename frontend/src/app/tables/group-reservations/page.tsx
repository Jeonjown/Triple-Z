import LoadingPage from "@/pages/LoadingPage";
import { DataTable } from "./data-table";
import useGetGroupReservations from "@/features/Events/hooks/useGetGroupReservations";
import { columns } from "./columns";

const GroupReservationsTable = () => {
  // Use optional chaining and fallback to an empty array
  const { data = { message: "", reservations: [] }, isPending } =
    useGetGroupReservations();
  const groupReservations = data ?? [];

  if (isPending) {
    return <LoadingPage />;
  }

  return <DataTable columns={columns} data={data} />;
};

export default GroupReservationsTable;
