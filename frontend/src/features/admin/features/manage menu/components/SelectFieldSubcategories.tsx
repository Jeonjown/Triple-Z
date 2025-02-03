import { ErrorMessage, Field } from "formik";
import useFetchAllSubcategories from "../hooks/useFetchAllSubcategories";
import useSubcategoryModal from "../hooks/useSubcategoryModal";
import SubcategoryModal from "./SubcategoryModal";
// Define the interface for each subcategory option
export interface SubcategoryOption {
  _id: string;
  subcategory: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  currentCategoryId: string | undefined;
  currentCategoryName: string | undefined;
}

const SelectFieldSubcategories = ({
  label,
  name,
  currentCategoryId,
  currentCategoryName,
}: SelectFieldProps) => {
  // If no categoryId, return empty array of subcategories
  const {
    data = [],
    isError,
    error,
  } = useFetchAllSubcategories(currentCategoryId ?? undefined);

  const { isModalOpen, setIsModalOpen } = useSubcategoryModal();

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      {isModalOpen && (
        <SubcategoryModal
          setIsModalOpen={setIsModalOpen}
          currentCategoryId={currentCategoryId}
          currentCategoryName={currentCategoryName}
          subcategoryData={data}
        />
      )}
      <div className="flex items-center space-x-1">
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>

        {/* EDIT ICON */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="hover:bg-secondary-dark mb-2 flex items-center justify-center rounded bg-secondary p-1 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      </div>
      <Field
        as="select"
        id={name}
        name={name}
        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
      >
        <option value="">Select {label}</option>
        {data.length === 0 ? (
          <option value="">No subcategories available</option> // Shows when no data is available
        ) : (
          data.map((option: SubcategoryOption) => (
            <option key={option._id} value={option._id}>
              {option.subcategory}
            </option>
          ))
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500"
      />
    </div>
  );
};

export default SelectFieldSubcategories;
