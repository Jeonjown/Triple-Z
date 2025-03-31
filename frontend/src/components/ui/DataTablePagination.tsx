export function DataTablePagination() {
  return (
    <div className="flex flex-col items-center space-y-4 border-t px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-4">
      {/* Info Section */}
      <div className="mt-4 flex w-full flex-col items-center justify-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
        {/* First info group */}
        <div className="flex flex-1 justify-center">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Confirmed:</p>
              <div className="h-4 w-4 rounded border bg-[#FABC2C]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Pending:</p>
              <div className="h-4 w-4 rounded bg-[#3BB537]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Canceled:</p>
              <div className="h-4 w-4 rounded bg-[#EE4549]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Completed:</p>
              <div className="h-4 w-4 rounded bg-[#043A7B]"></div>
            </div>
          </div>
        </div>
        {/* Second info group */}
        <div className="flex flex-1 justify-center">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Canceled:</p>
              <div className="h-4 w-4 rounded bg-[#EE4549]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Partially Paid:</p>
              <div className="h-4 w-4 rounded border bg-[#FABC2C]"></div>
            </div>
            <div className="flex items-center space-x-1">
              <p className="text-xs text-gray-600">Paid:</p>
              <div className="h-4 w-4 rounded bg-[#3BB537]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
