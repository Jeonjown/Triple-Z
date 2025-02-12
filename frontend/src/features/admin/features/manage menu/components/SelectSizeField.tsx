import { Button } from "@/components/ui/button";
import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import { Delete, Plus } from "lucide-react";

interface SizeField {
  size: string;
  sizePrice: number;
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
              <div key={index} className="flex animate-fadeIn space-x-4 py-1">
                <div className="flex-1">
                  <Field
                    name={`sizes[${index}].size`}
                    placeholder="Enter Size (e.g., Small)"
                    className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary sm:p-3"
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
                    className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary sm:p-3"
                  />
                  <ErrorMessage
                    name={`sizes[${index}].sizePrice`}
                    component="div"
                    className="text-xs text-red-500"
                  />
                </div>
                <Button
                  type="button"
                  variant={"destructive"}
                  onClick={() => remove(index)}
                >
                  <Delete />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => push({ size: "", sizePrice: 0 })}
              className="mt-1 text-xs"
              size={"sm"}
            >
              Add Size/Price
              <Plus />
            </Button>
          </div>
        )}
      />
    </>
  );
};

export default SelectSizeField;
