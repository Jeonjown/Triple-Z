interface TableOccupancyProgressProps {
  tablesOccupied: number;
  totalTables: number;
}

const TableOccupancyProgress = ({
  tablesOccupied,
  totalTables,
}: TableOccupancyProgressProps): JSX.Element => {
  // Cap progressPercentage at 100%
  const progressPercentage =
    totalTables > 0 ? Math.min((tablesOccupied / totalTables) * 100, 100) : 0;

  return (
    <div className="my-4 w-full">
      <div className="mb-2 text-sm font-medium text-gray-700">
        Table(s) You will Occupy: {tablesOccupied} / {totalTables}
      </div>
      <div className="relative h-4 w-full rounded-full bg-gray-200">
        <div
          className="h-4 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TableOccupancyProgress;
