import { ErrorMessage, Field, useFormikContext } from "formik";
import useFetchAllSubcategories from "../hooks/useFetchAllSubcategories";
import useSubcategoryModal from "../hooks/useSubcategoryModal";
import SubcategoryModal from "./SubcategoryModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";

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
  currentSubcategoryId: string | undefined;
  setCurrentSubcategoryId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

const SelectFieldSubcategories = ({
  label,
  name,
  currentCategoryId,
  currentCategoryName,
  currentSubcategoryId,
  setCurrentSubcategoryId,
}: SelectFieldProps) => {
  const { setFieldValue } = useFormikContext(); // Added to update Formik state
  // Fetch subcategories based on the currentCategoryId
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
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger type="button">
              <Button
                type="button"
                className="mb-2 h-2 w-2 p-3"
                onClick={() => setIsModalOpen(true)}
              >
                <SquarePen className="!size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>Edit Subcategory</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Field
        as="select"
        id={name}
        name={name}
        value={currentSubcategoryId} // Controlled by state
        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary sm:p-3"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedSubcategoryId = e.target.value;
          // Update local state
          setCurrentSubcategoryId(selectedSubcategoryId);
          // Update Formik's value
          setFieldValue(name, selectedSubcategoryId);
        }}
      >
        <option value="">Select {label}</option>
        {data.length === 0 ? (
          <option value="">No subcategories available</option>
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
