import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MenuItem } from "../pages/ManageMenu";
import InputField from "./InputField";
import ImageUpload from "./ImageUpload";
import SelectSizeField from "./SelectSizeField";
import { FormValues } from "./CreateMenuItemModal";
import { useEditMenuItem } from "../hooks/useEditMenuItem";

interface EditMenuItemModalProps {
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setItemToEdit: React.Dispatch<React.SetStateAction<MenuItem | null>>;
  itemToEdit: MenuItem | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required."),
  description: Yup.string().required("Description is required."),
  basePrice: Yup.number()
    .nullable()
    .when("requiresSizeSelection", {
      is: false,
      then: (schema) => schema.required("Base price is required."),
    }),
  requiresSizeSelection: Yup.boolean(),
  sizes: Yup.array().of(
    Yup.object().shape({
      size: Yup.string().required("Size is required."),
      sizePrice: Yup.number().required("Size price is required."),
    }),
  ),
});

const EditMenuItemModal = ({
  setItemToEdit,
  setEditMode,
  itemToEdit,
}: EditMenuItemModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    itemToEdit?.image || null,
  );
  const { mutate } = useEditMenuItem();

  const handleSubmit = (values: FormValues) => {
    console.log("Updated values:", values);
    mutate(values);
    setItemToEdit(null);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={() => setEditMode(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

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
            category: itemToEdit?.category || "",
            subcategory: itemToEdit?.subcategory || "",
            requiresSizeSelection: itemToEdit?.requiresSizeSelection || false,
            sizes: itemToEdit?.sizes || [],
            availability: itemToEdit?.availability,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              <ImageUpload
                imagePreview={imagePreview}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // If a new image file is selected, update the form value
                    setFieldValue("image", file); // Update with the new file
                    setImagePreview(URL.createObjectURL(file)); // Show preview of the selected image
                  } else {
                    // If no file is selected, retain the current image (do nothing)
                    setFieldValue("image", values.image); // Keep the existing image
                  }
                }}
                name="image"
              />
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
                      className="h-4 w-4 rounded-full border-gray-300 text-secondary focus:ring-secondary"
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
                      className="h-4 w-4 rounded-full border-gray-300 text-secondary focus:ring-secondary"
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
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <InputField
                  label="Item Name"
                  name="title"
                  type="text"
                  placeholder="Enter item name"
                />
                {!values.requiresSizeSelection && (
                  <InputField
                    label="Base Price"
                    name="basePrice"
                    type="number"
                    placeholder="Enter price"
                  />
                )}
              </div>

              <InputField
                label="Description"
                name="description"
                type="text"
                placeholder="Enter description"
              />

              {values.requiresSizeSelection && <SelectSizeField />}

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
                  className="rounded border-gray-300 text-secondary focus:ring-secondary"
                />
                <span className="text-xs">Is Size Required?</span>
              </label>

              <ErrorMessage
                name="basePrice"
                component="div"
                className="text-xs text-red-500"
              />

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hover:bg-secondary-dark rounded-md bg-secondary px-4 py-2 text-white"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
