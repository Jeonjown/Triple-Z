import { ErrorMessage, Field } from "formik";
import useFetchAllSubcategories from "../../hooks/useFetchAllSubcategories";

// Define the interface for each subcategory option
interface SubcategoryOption {
  _id: string;
  subcategory: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  currentCategory: string | undefined;
}

const SelectFieldSubcategories = ({
  label,
  name,
  currentCategory,
}: SelectFieldProps) => {
  const { data, isPending, isError, error } = useFetchAllSubcategories(
    currentCategory || "",
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center space-x-1">
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <p className="text-sm">category: {currentCategory}</p>
      </div>
      <Field
        as="select"
        id={name}
        name={name}
        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
      >
        <option value="">Select {label}</option>
        {/* Now TypeScript knows that each 'option' is a SubcategoryOption */}
        {data.map((option: SubcategoryOption) => (
          <option key={option._id} value={option._id}>
            {option.subcategory}
          </option>
        ))}
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
