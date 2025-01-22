import { flexRender, Table } from "@tanstack/react-table";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  actions?: JSX.Element;
}

interface CardViewProps {
  table: Table<User>;
  globalFilter: string | undefined;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CardView = ({ table }: CardViewProps) => {
  return (
    <>
      <div className="grid w-5/6 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Data Rows Rendered as Cards */}
        {table.getRowModel().rows.map((row) => (
          // CARD
          <div
            key={row.id}
            className="flex min-w-0 flex-col space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:scale-105 hover:border-secondary hover:shadow-xl"
          >
            {/* Individual Cells as Key-Value Pairs */}
            {row.getVisibleCells().map((cell) => {
              // Find the matching header for this cell
              const header = table
                .getHeaderGroups()
                .flatMap((group) => group.headers)
                .find((h) => h.id === cell.column.id);

              return (
                <div
                  key={cell.id}
                  className="flex items-center justify-between text-gray-600"
                >
                  {/* Check if header exists */}
                  {header && (
                    <div
                      className="flex items-center hover:scale-110 hover:cursor-pointer hover:opacity-80"
                      onClick={header.column.getToggleSortingHandler?.()}
                    >
                      {header?.column.columnDef.header !== "Actions" && (
                        <span className="text-sm font-medium">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      )}
                      {header.column.columnDef.header === "Actions" ? (
                        ""
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="ml-1 mr-3 size-3"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8 6.4a.75.75 0 0 0-.04 1.06l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75a.75.75 0 0 0-1.5 0v8.59l-1.95-2.1a.75.75 0 0 0-1.06-.04Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                  <span className="truncate text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default CardView;
