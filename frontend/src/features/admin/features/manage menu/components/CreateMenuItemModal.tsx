import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import ImageUpload from "./ImageUpload";
import InputField from "./InputField";
import SelectFieldCategories from "./SelectFieldCategories";
import useFetchAllCategories from "../../hooks/useFetchAllCategories";
import SelectFieldSubcategories from "./SelectFieldSubcategories";

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
    price: Yup.number()
      .required("Price is required.")
      .min(0, "Price must not be less than 0")
      .typeError("Price must be a number."),
    description: Yup.string().required("Description is required."),
    category: Yup.string().required("Category is required."),
    subcategory: Yup.string().required("Subcategory is required."),
  });

  interface FormValues {
    image: string;
    title: string;
    price: string;
    size: string;
    description: string;
    category: string;
    subcategory: string;
  }

  const initialValues = {
    image: "",
    title: "",
    price: "",
    size: "",
    description: "",
    category: "",
    subcategory: "",
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
    // Find the keys of the missing fields
    const missingFields = Object.keys(values).filter(
      (field) => !values[field as keyof typeof initialValues],
    );

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields.join(", "));
    } else {
      console.log("All fields have values!");
    }
  };
  if (!isCreateModalOpen) return null;

  if (isPending) {
    return <div>Loading categories...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

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

              {/* Title, Price, Size Fields */}
              <div className="flex flex-col space-y-4 sm:flex sm:flex-row sm:space-x-4 sm:space-y-0">
                {/* Title */}
                <InputField
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter the title"
                />
                {/* Price */}
                <InputField
                  label="Price"
                  name="price"
                  type="number"
                  placeholder="Enter the price"
                />

                {/* Size */}
                <div className="flex-1">
                  {isSizeRequired && (
                    <>
                      <div className="flex items-center space-x-1">
                        <label
                          htmlFor="size"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Size
                        </label>
                        <button className="hover:bg-secondary-dark -mt-2 flex items-center justify-center rounded bg-secondary p-1 text-white focus:outline-none focus:ring-2 focus:ring-secondary">
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
                        id="size"
                        name="size"
                        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
                      >
                        <option value="">Select Size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </Field>
                    </>
                  )}

                  <div className="mt-auto flex">
                    <ErrorMessage
                      name="size"
                      component="div"
                      className="text-xs text-red-500"
                    />
                    <label className="ml-auto mt-auto flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSizeRequired}
                        onChange={(e) => setIsSizeRequired(e.target.checked)}
                        className="rounded border-gray-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-xs">Is Size Required?</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Category & Subcategory Fields */}
              <div className="space-y-4">
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
                  onClick={() => testFields(values)} // Test values here
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
