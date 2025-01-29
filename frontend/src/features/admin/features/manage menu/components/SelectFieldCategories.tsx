import { ErrorMessage, Field, useFormikContext } from "formik";
import React from "react";

interface SelectFieldProps {
  label: string;
  name: string;
  data: { category: string; _id: string }[];
  setCurrentCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentCategory: string | undefined;
}

const SelectFieldCategories = ({
  label,
  name,
  data,
  setCurrentCategory,
  currentCategory,
}: SelectFieldProps) => {
  const { setFieldValue } = useFormikContext(); // Access Formik context

  return (
    <div>
      <div className="flex items-center space-x-1">
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      </div>
      <Field
        as="select"
        id={name}
        name={name}
        value={currentCategory}
        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedValue = e.target.value;
          setCurrentCategory(selectedValue); // Update local state
          setFieldValue(name, selectedValue); // Update Formik state
        }}
      >
        <option value="">Select {label}</option>
        {data.map((option) => (
          <option key={option._id} value={option._id}>
            {option.category}
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

export default SelectFieldCategories;
