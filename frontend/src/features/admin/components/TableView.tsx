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

interface TableViewProps {
  table: Table<User>;
}

const TableView = ({ table }: TableViewProps) => {
  return (
    <div className="mx-auto w-5/6 flex-col rounded-lg">
      <div className="rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={` ${header.column.id === "_id" ? "hidden xl:table-cell" : ""} ${header.column.id === "role" ? "hidden sm:table-cell md:table-cell" : ""} ${header.column.id === "email" ? "hidden lg:table-cell" : ""} ${header.column.id === "username" || header.column.id === "actions" ? "sm:table-cell" : ""} ${(header.column.id === "role" || header.column.id === "email") && "lg:table-cell"} bg-secondary px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white`}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.columnDef.header !== "Actions" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="ml-2 size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8 6.4a.75.75 0 0 0-.04 1.06l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75a.75.75 0 0 0-1.5 0v8.59l-1.95-2.1a.75.75 0 0 0-1.06-.04Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition hover:scale-105 hover:border-2 hover:bg-gray-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={` ${cell.column.id === "_id" ? "hidden xl:table-cell" : ""} ${cell.column.id === "role" ? "hidden sm:table-cell md:table-cell" : ""} ${cell.column.id === "email" ? "hidden lg:table-cell" : ""} ${cell.column.id === "username" || cell.column.id === "actions" ? "sm:table-cell" : ""} ${(cell.column.id === "role" || cell.column.id === "email") && "lg:table-cell"} whitespace-nowrap px-6 py-4 text-sm text-text`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
