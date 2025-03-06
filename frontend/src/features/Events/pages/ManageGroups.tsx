import GroupReservationsTable from "@/app/tables/group-reservations/page";

const ManageGroups = () => {
  return (
    <div className="flex justify-center">
      <div className="w-auto min-w-96">
        <GroupReservationsTable />
      </div>
    </div>
  );
};

export default ManageGroups;
