import { flexRender, Table } from "@tanstack/react-table";
import { MenuItem } from "../pages/ManageMenu";

const MenuTableView = ({ table }: { table: Table<MenuItem> }) => {
  return (
    <>
      <div className="mx-auto w-5/6 flex-col rounded-lg">
        <div className="rounded-lg bg-white shadow-md">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-secondary">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    // Determine header class based on the column ID
                    const headerClass = `
                     max-w- truncate whitespace-nowrap px-6 py-3 text-xs font-medium uppercase tracking-wider text-white
                     bg-secondary
                      ${header.id === "item" ? "" : ""} 
                      ${header.id === "price" ? "" : ""}
                      ${header.id === "availability" || header.id === "category" ? "hidden lg:table-cell" : ""}
                      ${header.id === "image" || header.id === "_id" ? "hidden xl:table-cell" : ""}
                    `.trim();

                    return (
                      <th key={header.id} className={headerClass}>
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
                          {header.column.columnDef.header && (
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
                    );
                  })}
                  <th className="bg-secondary px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <>
                  <tr
                    key={row.id}
                    className="transition hover:scale-105 hover:border-2 hover:bg-gray-200"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { id } = cell.column;

                      // Determine the cell class based on the column id
                      const cellClass = `
                      max-w-48 truncate whitespace-nowrap px-6 py-4 text-sm text-text
                      ${id === "item" ? "" : ""} 
                      ${id === "price" ? "" : ""}
                      ${id === "availability" || id === "category" ? "hidden lg:table-cell" : ""}
                      ${id === "image" || id === "_id" ? "hidden xl:table-cell" : ""}
                    `.trim();

                      return (
                        <td key={cell.id} className={cellClass}>
                          {id === "availability" ? (
                            <span className="truncate text-sm">
                              {cell.getValue() ? "Yes" : "No"}
                            </span>
                          ) : id === "image" ? (
                            <img
                              src={cell.getValue() as string}
                              alt="Image"
                              className="h-16 w-16 rounded object-cover"
                            />
                          ) : (
                            <span className="truncate text-sm">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="mt-1 flex items-center gap-2 py-4">
                      <button
                        // onClick={() => handleEdit(row.original)}
                        className="rounded bg-secondary px-3 py-2 text-white hover:opacity-85"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        // onClick={() => handleDelete(row.original)}
                        className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MenuTableView;
