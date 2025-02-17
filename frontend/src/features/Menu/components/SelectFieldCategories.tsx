import { ErrorMessage, Field, useFormikContext } from "formik";
import React from "react";
import CategoryModal from "./CategoryModal";
import useCategoryModal from "../hooks/useCategoryModal";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger type="button">
              <Button
                type="button"
                className="mb-2 h-2 w-2 p-3"
                onClick={() => setIsEditModalOpen(true)}
              >
                <SquarePen className="!size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>Edit Category</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Field
        as="select"
        id={name}
        name={name}
        value={currentCategoryId}
        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary sm:p-3"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedValue = e.target.value;
          console.log("Selected category ID:", selectedValue);
          const selectedOption = data.find(
            (option) => option._id === selectedValue,
          );
          setCurrentCategoryName(selectedOption ? selectedOption.category : "");
          setCurrentCategoryId(selectedValue);
          setFieldValue(name, selectedValue);
        }}
      >
        <option value="">Select {label}</option>
        {data && Array.isArray(data) && data.length > 0 ? (
          data.map((option) => (
            <option key={option._id} value={option._id}>
              {option.category}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
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

export default SelectFieldCategories;
