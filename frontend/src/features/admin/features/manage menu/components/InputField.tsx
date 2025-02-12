import { ErrorMessage, Field, FieldProps } from "formik";
import { useDisableNumberInputScroll } from "../hooks/useDisableNumberInputScroll";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}

const InputField = ({ label, name, type, placeholder }: InputFieldProps) => {
  useDisableNumberInputScroll();
  return (
    <div className="flex-1">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Field name={name}>
        {({ field }: FieldProps<Record<string, unknown>>) => (
          <input
            {...field}
            type={type}
            id={name}
            placeholder={placeholder}
            // Ensure the value is always a string (controlled)
            value={field.value == null ? "" : String(field.value)}
            className="w-full animate-fadeIn rounded-md border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary sm:p-3"
          />
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

export default InputField;
