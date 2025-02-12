import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MenuItem } from "../pages/ManageMenu";
import InputField from "./InputField";
import ImageUpload from "./ImageUpload";
import SelectSizeField from "./SelectSizeField";
import { FormValues } from "./CreateMenuItemModal";
import { useEditMenuItem } from "../hooks/useEditMenuItem";
import SelectFieldCategories from "./SelectFieldCategories";
import SelectFieldSubcategories from "./SelectFieldSubcategories";
import useFetchAllCategories from "../hooks/useFetchAllCategories";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useDisableNumberInputScroll from "../hooks/useDisableNumberInputScroll";
import LoadingPage from "@/pages/LoadingPage";

interface EditMenuItemModalProps {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setItemToEdit: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  itemToEdit: MenuItem | null;
}

// Yup validation schema with conditional sizes validation
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required."),
  description: Yup.string().required("Description is required."),
  basePrice: Yup.number()
    .nullable()
    .min(0, "Base price cannot be negative.")
    .when("requiresSizeSelection", {
      is: false,
      then: (schema) => schema.required("Base price is required."),
    }),
  requiresSizeSelection: Yup.boolean(),
  sizes: Yup.array()
    .of(
      Yup.object().shape({
        size: Yup.string().required("Size is required."),
        sizePrice: Yup.number()
          .min(0, "Size price cannot be negative.")
          .required("Size price is required."),
      }),
    )
    .when("requiresSizeSelection", {
      is: true,
      then: (schema) => schema.min(1, "At least one size must be added."), // must have at least one size when required
      otherwise: (schema) => schema.notRequired(),
    }),
});

const EditMenuItemModal = ({
  setItemToEdit,
  setEditMode,
  itemToEdit,
}: EditMenuItemModalProps) => {
  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(
    itemToEdit?.image || null,
  );

  useDisableNumberInputScroll();

  // Category and subcategory state management
  const [currentCategoryId, setCurrentCategoryId] = useState<
    string | undefined
  >(itemToEdit?.categoryId);
  const [currentCategoryName, setCurrentCategoryName] = useState<
    string | undefined
  >(itemToEdit?.categoryName);
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<
    string | undefined
  >(itemToEdit?.subcategoryId);

  const { mutate, isPending } = useEditMenuItem();
  const { data: categories } = useFetchAllCategories();

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    console.log("Updated values:", values);
    mutate(values);
    setItemToEdit(null);
    setEditMode(false);
  };

  if (isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:p-8">
        {/* Close modal button */}
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => setEditMode(false)}
          className="absolute right-4 top-4"
        >
          <X className="!size-7" />
        </Button>

        <h2 className="mb-4 text-xl font-semibold text-gray-800 sm:text-2xl">
          Edit Menu Item
        </h2>

        <Formik
          initialValues={{
            _id: itemToEdit?._id,
            image: itemToEdit?.image || null,
            title: itemToEdit?.title || "",
            basePrice: itemToEdit?.basePrice ?? null,
            description: itemToEdit?.description || "",
            category: currentCategoryId || "",
            subcategory: currentSubcategoryId || "",
            requiresSizeSelection: itemToEdit?.requiresSizeSelection || false,
            sizes: itemToEdit?.sizes || [],
            availability: itemToEdit?.availability,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              {/* Image Upload */}
              <ImageUpload
                imagePreview={imagePreview}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFieldValue("image", file); // update with new file
                    setImagePreview(URL.createObjectURL(file)); // update preview
                  } else {
                    setFieldValue("image", values.image); // keep current image
                  }
                }}
                name="image"
              />

              {/* Availability */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Availability
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      name="availability"
                      value={true}
                      className="h-4 w-4 rounded-full border-gray-300 text-secondary focus:ring-primary"
                      checked={values.availability === true}
                      onChange={() => setFieldValue("availability", true)}
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      name="availability"
                      value={false}
                      className="h-4 w-4 rounded-full border-gray-300 text-secondary focus:ring-primary"
                      checked={values.availability === false}
                      onChange={() => setFieldValue("availability", false)}
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
                <ErrorMessage
                  name="availability"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Title and Base Price */}
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <InputField
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter the title"
                />
                {!values.requiresSizeSelection && (
                  <InputField
                    label="Base price"
                    name="basePrice"
                    type="number"
                    placeholder="Enter the price"
                  />
                )}
              </div>

              {/* Size selection with custom error rendering */}
              {values.requiresSizeSelection && (
                <>
                  <SelectSizeField />
                  <ErrorMessage name="sizes">
                    {(errorMsg) => (
                      <div className="text-xs text-red-500">
                        {typeof errorMsg === "string"
                          ? errorMsg
                          : JSON.stringify(errorMsg)}
                      </div>
                    )}
                  </ErrorMessage>
                </>
              )}

              {/* Checkbox to toggle size requirement */}
              <label className="ml-auto mt-auto flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={values.requiresSizeSelection}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFieldValue("requiresSizeSelection", isChecked);
                    if (isChecked) {
                      setFieldValue("basePrice", null);
                      if (values.sizes.length === 0)
                        setFieldValue("sizes", [{ size: "", sizePrice: null }]);
                    } else {
                      setFieldValue("sizes", []);
                    }
                  }}
                  className="rounded border-gray-300 text-secondary focus:ring-primary"
                />
                <span className="text-xs">Is Size Required?</span>
              </label>

              {/* Category and Subcategory */}
              <div className="space-y-4">
                <SelectFieldCategories
                  label="Category"
                  name="category"
                  setCurrentCategoryId={setCurrentCategoryId}
                  setCurrentCategoryName={setCurrentCategoryName}
                  data={categories}
                  currentCategoryId={currentCategoryId}
                />
                {currentCategoryId && (
                  <SelectFieldSubcategories
                    label="Subcategory"
                    name="subcategory"
                    currentCategoryId={currentCategoryId}
                    currentCategoryName={currentCategoryName}
                    currentSubcategoryId={currentSubcategoryId}
                    setCurrentSubcategoryId={setCurrentSubcategoryId}
                  />
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary sm:p-3"
                  placeholder="Write Description Here"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant={"secondary"}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
