import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";

interface SizeField {
  size: string;
  price: number;
}

const SelectSizeField = () => {
  const { values } = useFormikContext<{ sizes: SizeField[] }>();

  return (
    <>
      <label
        htmlFor="size"
        className="-mb-4 block text-sm font-medium text-gray-700"
      >
        Size
      </label>

      <FieldArray
        name="sizes"
        render={({ push, remove }) => (
          <div>
            {values.sizes?.map((_, index) => (
              <div key={index} className="flex space-x-4 py-1">
                <div className="flex-1">
                  <Field
                    name={`sizes[${index}].size`}
                    placeholder="Enter Size (e.g., Small)"
                    className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
                  />
                  <ErrorMessage
                    name={`sizes[${index}].size`}
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <div className="flex-1">
                  <Field
                    name={`sizes[${index}].sizePrice`}
                    type="number"
                    placeholder="Enter Price"
                    className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
                  />
                  <ErrorMessage
                    name={`sizes[${index}].price`}
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)} // Remove size/price pair
                  className="rounded-md border bg-primary px-2 text-xs text-red-500 hover:bg-gray-200"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => push({ size: "", price: 0 })} // Add new size/price pair
              className="mt-4 rounded bg-secondary px-2 py-1 text-sm text-white"
            >
              Add Size/Price
            </button>
          </div>
        )}
      />
    </>
  );
};

export default SelectSizeField;
