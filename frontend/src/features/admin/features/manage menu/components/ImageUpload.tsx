import { ErrorMessage } from "formik";

const ImageUpload = ({
  imagePreview,
  onChange,
  name,
}: {
  imagePreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}) => {
  return (
    <>
      <div className="items-center justify-center space-x-4 sm:flex sm:flex-row-reverse">
        {imagePreview && (
          <div className="mt-4 flex-1 sm:mt-0 sm:w-1/4">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mx-auto max-h-[200px] min-h-[200px] rounded object-scale-down"
            />
          </div>
        )}
        <label
          htmlFor="image"
          className="mt-5 flex h-40 w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 sm:mt-0"
        >
          <div className="flex flex-1 flex-col items-center justify-center pb-4 pt-4">
            <svg
              className="mb-2 h-6 w-6 text-gray-500"
              viewBox="0 0 20 16"
              fill="none"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="text-xs text-gray-500">
              WEBP, PNG, JPG (MAX. 300x300px)
            </p>
          </div>
          <input
            id="image"
            type="file"
            className="hidden"
            onChange={onChange}
          />
        </label>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-xs text-red-500"
      />
    </>
  );
};

export default ImageUpload;
