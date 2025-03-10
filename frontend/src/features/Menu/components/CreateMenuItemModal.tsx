import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import ImageUpload from "./ImageUpload"; // Ensure this component handles image preview
import InputField from "./InputField"; // A custom input field component
import SelectFieldCategories from "./SelectFieldCategories"; // Custom category selector
import useFetchAllCategories from "../hooks/useFetchAllCategories"; // Hook for fetching categories
import SelectFieldSubcategories from "./SelectFieldSubcategories"; // Custom subcategory selector
import SelectSizeField from "./SelectSizeField"; // Custom component for sizes
import { useCreateMenuItem } from "../hooks/useCreateMenuItem"; // Hook for creating menu items
import { MenuItemData } from "../api/menu";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import useDisableNumberInputScroll from "../hooks/useDisableNumberInputScroll";

interface CreateMenuItemModalProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormValues {
  _id?: string;
  requiresSizeSelection: boolean;
  image: File | string | null;
  title: string;
  basePrice: number | null;
  description: string;
  category: string;
  subcategory: string;
  sizes: { size: string; sizePrice: number }[];
  availability?: boolean;
}

const CreateMenuItemModal = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
}: CreateMenuItemModalProps) => {
  const {
    data: categories,
    isPending,
    isError,
    error,
  } = useFetchAllCategories();
  const {
    mutate,
    isPending: mutationPending,
    isError: mutationError,
    error: mutationErrorMessage,
  } = useCreateMenuItem();

  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<
    string | undefined
  >("");
  const [currentCategoryId, setCurrentCategoryId] = useState<
    string | undefined
  >("");
  const [currentCategoryName, setCurrentCategoryName] = useState<
    string | undefined
  >("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useDisableNumberInputScroll();
  // Yup validation schema
  const validationSchema = Yup.object()
    .shape({
      image: Yup.mixed().required("Image is required."),
      title: Yup.string().required("Title is required."),
      description: Yup.string().required("Description is required."),
      category: Yup.string().required("Category is required."),
      subcategory: Yup.string().required("Subcategory is required."),
      sizes: Yup.array()
        .of(
          Yup.object().shape({
            size: Yup.string().required("Size is required."),
            sizePrice: Yup.number()
              .required("Size price is required.")
              .min(0, "Size price cannot be negative."),
          }),
        )
        .when("requiresSizeSelection", {
          is: true,
          then: (schema) =>
            schema.min(1, "At least one size must be selected."),
          otherwise: (schema) =>
            schema.test(
              "empty-sizes",
              "",
              (value) => !value || value.length === 0,
            ),
        }),
      basePrice: Yup.number()
        .nullable()
        .min(0, "Base price cannot be negative.")
        .when("requiresSizeSelection", {
          is: false,
          then: (schema) => schema.required("Base price is required."),
          otherwise: (schema) => schema.notRequired(),
        }),
      requiresSizeSelection: Yup.boolean(),
    })
    .test(
      "price-check",
      "Either a base price or at least one size price is required.",
      function (values) {
        const { requiresSizeSelection, basePrice, sizes } =
          values as FormValues;

        if (!requiresSizeSelection) {
          // Check that basePrice is neither null nor undefined and greater than 0
          return basePrice !== null && basePrice > 0;
        }
        // If size selection is required, ensure that there are sizes available
        return sizes && sizes.length > 0;
      },
    );

  const initialValues: FormValues = {
    image: null,
    title: "",
    basePrice: null,
    description: "",
    category: "",
    subcategory: "",
    requiresSizeSelection: false,
    sizes: [],
  };

  const handleSubmit = (values: FormValues) => {
    if (!values.image) {
      alert("Image is required.");
      return;
    }

    const menuItemData: MenuItemData = {
      category: values.category,
      subcategory: values.subcategory,
      item: {
        title: values.title,
        basePrice: values.basePrice,
        requiresSizeSelection: values.requiresSizeSelection,
        description: values.description,
        sizes: values.requiresSizeSelection ? values.sizes : [],
      },
      image: values.image,
    };

    mutate(menuItemData);
    setIsCreateModalOpen(false);
    setImagePreview(null);
  };

  // Handle image change
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image file.");
    }
  };

  if (isPending || mutationPending) return <div>Loading...</div>;
  if (isError || mutationError)
    return <div>Error: {error?.message || mutationErrorMessage?.message}</div>;
  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsCreateModalOpen(false)}
          className="absolute right-4 top-4"
        >
          <X className="!size-7" />
        </Button>

        <h2 className="mb-4 text-xl font-semibold text-gray-800 sm:text-2xl">
          Create Menu Item
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-4">
              {/* Image Upload */}
              <ImageUpload
                imagePreview={imagePreview}
                onChange={(e) => handleImageChange(e, setFieldValue)}
                name="image"
              />

              {/* Form Fields */}
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

              <div className="space-y-4">
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
                          setFieldValue("sizes", [
                            { size: "", sizePrice: null },
                          ]);
                      } else {
                        setFieldValue("sizes", []);
                      }
                    }}
                    className="rounded border-gray-300 text-secondary focus:ring-primary"
                  />
                  <span className="text-xs">Is Size Required?</span>
                </label>

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

              {/* Description Field */}
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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  variant={"secondary"}
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

export default CreateMenuItemModal;
