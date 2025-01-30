import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import ImageUpload from "./ImageUpload";
import InputField from "./InputField";
import SelectFieldCategories from "./SelectFieldCategories";
import useFetchAllCategories from "../../hooks/useFetchAllCategories";
import SelectFieldSubcategories from "./SelectFieldSubcategories";
import SelectSizeField from "./SelectSizeField";

interface CreateMenuItemModalProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

  const [currentCategory, setCurrentCategory] = useState<string | undefined>(
    "",
  );
  const [isSizeRequired, setIsSizeRequired] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validationSchema = Yup.object({
    image: Yup.string().required("Image is required."),
    title: Yup.string().required("Title is required."),
    description: Yup.string().required("Description is required."),
    category: Yup.string().required("Category is required."),
    subcategory: Yup.string().required("Subcategory is required."),
    sizes: Yup.array().of(
      Yup.object().shape({
        size: Yup.string().when(
          "requiresSizeSelection",
          (requiresSizeSelection, schema) => {
            return requiresSizeSelection
              ? schema.required("Size is required.")
              : schema.notRequired();
          },
        ),
        sizePrice: Yup.number().when(
          "requiresSizeSelection",
          (requiresSizeSelection, schema) => {
            return requiresSizeSelection
              ? schema.required("sizePrice is required.")
              : schema.notRequired();
          },
        ),
      }),
    ),
    basePrice: Yup.number().when(
      "requiresSizeSelection",
      (requiresSizeSelection, schema) => {
        return !requiresSizeSelection
          ? schema.required("Base price is required.")
          : schema.notRequired();
      },
    ),
  });
  interface FormValues {
    requiresSizeSelection: boolean;
    image: string;
    title: string;
    basePrice: number;
    description: string;
    category: string;
    subcategory: string;
    sizes: { size: string; sizePrice: number }[];
  }
  const initialValues = {
    image: "",
    title: "",
    basePrice: 0,
    description: "",
    category: "",
    subcategory: "",
    requiresSizeSelection: isSizeRequired,
    sizes: [{ size: "", sizePrice: 0 }],
  };

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    setIsCreateModalOpen(false); // Close the modal
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string | null;
        if (imageData) {
          setImagePreview(imageData);
          setFieldValue("image", imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // New method for testing if all fields have values
  const testFields = (values: typeof initialValues) => {
    // Log the values for debugging
    console.log("Form values:", values);

    // Destructure necessary values
    const { requiresSizeSelection, sizes, basePrice } = values;

    const missingFields: string[] = [];

    // Check for basePrice when size selection is not required
    if (
      !requiresSizeSelection &&
      (basePrice === null || basePrice === undefined)
    ) {
      missingFields.push("basePrice");
    }

    // Check for sizes[0].sizePrice when size selection is required
    if (
      requiresSizeSelection &&
      (sizes[0].sizePrice === null || sizes[0].sizePrice === undefined)
    ) {
      missingFields.push("sizes[0].sizePrice");
    }

    // Check for sizes[0].size when size selection is required
    if (
      requiresSizeSelection &&
      (sizes[0].size.trim() === "" || sizes[0].size === undefined)
    ) {
      missingFields.push("sizes[0].size");
    }

    // Check for missing general fields (image, title, description, etc.)
    Object.keys(values).forEach((field) => {
      const value = values[field as keyof typeof initialValues];

      if (Array.isArray(value) && value.length === 0) {
        missingFields.push(field);
      }

      if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
      ) {
        missingFields.push(field);
      }
    });

    // Log the result
    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields.join(", "));
    } else {
      console.log("All fields have values!");
    }
  };

  if (isPending) {
    return <div>Loading categories...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsCreateModalOpen(false)}
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
          Create Menu Item
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={true}
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

              {/* Title, Price,  Fields */}
              <div className="flex flex-col space-y-4 sm:flex sm:flex-row sm:space-x-4 sm:space-y-0">
                {/* Title */}
                <InputField
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter the title"
                />
                {/* Price */}
                {!isSizeRequired && (
                  <InputField
                    label="Base price"
                    name="basePrice"
                    type="number"
                    placeholder="Enter the price"
                  />
                )}
              </div>

              {/* Category, Subcategory, Size, Fields */}
              <div className="space-y-4">
                {/* Size */}
                {isSizeRequired && <SelectSizeField />}

                <label className="ml-auto mt-auto flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={values.requiresSizeSelection}
                    onChange={(e) => {
                      setIsSizeRequired(e.target.checked);
                      setFieldValue("requiresSizeSelection", e.target.checked);
                    }}
                    className="rounded border-gray-300 text-secondary focus:ring-secondary"
                  />
                  <span className="text-xs">Is Size Required?</span>
                </label>
                <SelectFieldCategories
                  label="Category"
                  name="category"
                  setCurrentCategory={setCurrentCategory}
                  data={categories}
                  currentCategory={currentCategory}
                />

                <SelectFieldSubcategories
                  label="Subcategory"
                  name="subcategory"
                  currentCategory={currentCategory}
                />
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
                  className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
                  placeholder="Write Description Here"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Test Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button" // Use button type "button" to avoid form submission
                  onClick={() => testFields(values)} // Test values here
                  className="hover:bg-secondary-dark rounded-md bg-secondary px-4 py-2 text-white"
                >
                  Test Fields
                </button>
                <button
                  type="submit"
                  className="hover:bg-secondary-dark rounded-md bg-secondary px-4 py-2 text-white"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateMenuItemModal;
