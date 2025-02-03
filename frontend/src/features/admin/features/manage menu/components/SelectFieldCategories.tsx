import { ErrorMessage, Field, useFormikContext } from "formik";
import React from "react";
import CategoryModal from "./CategoryModal";
import useCategoryModal from "../hooks/useCategoryModal";

interface SelectFieldProps {
  label: string;
  name: string;
  data: { category: string; _id: string }[];
  setCurrentCategoryName: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setCurrentCategoryId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  currentCategoryId: string | undefined;
}

const SelectFieldCategories = ({
  label,
  name,
  data,
  setCurrentCategoryId,
  setCurrentCategoryName,
  currentCategoryId,
}: SelectFieldProps) => {
  const { setIsEditModalOpen, isEditModalOpen } = useCategoryModal();
  const { setFieldValue } = useFormikContext();

  return (
    <div>
      <div className="flex items-center space-x-1">
        {isEditModalOpen && (
          <CategoryModal
            setCurrentCategoryId={setCurrentCategoryId}
            setIsEditModalOpen={setIsEditModalOpen}
            categories={data}
          />
        )}

        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        {/* EDIT ICON */}
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
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
        value={currentCategoryId}
        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedValue = e.target.value;
          // Find the selected option in your data array
          const selectedOption = data.find(
            (option) => option._id === selectedValue,
          );
          // Update the category name with the selected option's category value
          setCurrentCategoryName(selectedOption ? selectedOption.category : "");
          // Update the ID states and Formik value
          setCurrentCategoryId(selectedValue);
          setFieldValue(name, selectedValue);
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
