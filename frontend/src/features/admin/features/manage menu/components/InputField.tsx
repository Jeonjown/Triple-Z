import { ErrorMessage, Field } from "formik";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
}

const InputField = ({ label, name, type, placeholder }: InputFieldProps) => {
  return (
    <div className="flex-1">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Field
        type={type}
        id={name}
        name={name}
        className="w-full rounded-md border p-2 text-sm focus:outline-none focus:ring focus:ring-secondary sm:p-3"
        placeholder={placeholder}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500"
      />
    </div>
  );
};

export default InputField;
