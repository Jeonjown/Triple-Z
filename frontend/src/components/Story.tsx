import { FC } from "react"; // Import FC to avoid implicit any
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Story: FC = () => {
  return (
    <section className="flex flex-col md:flex-row">
      {/* Image container taking equal space */}
      <div className="flex-1">
        <img
          src="triple-z-clean.png"
          alt="Triple Z Tarpaulin"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Text container with centered content and fixed max-width on large screens */}
      <div className="flex flex-1 flex-col items-center justify-center bg-primary p-10">
        {/* Wrapper to constrain text width on large screens */}
        <div className="mx-auto max-w-3xl lg:mx-0">
          {/* Header text: centered on small, left-aligned on large */}
          <h2 className="mb-4 mt-5 text-center font-heading text-3xl font-bold text-white md:text-4xl lg:text-left lg:text-5xl">
            The Story of Triple Z Coffee
          </h2>

          {/* Paragraph: corrected typo ("thef" → "the") and improved grammar */}
          <p className="mt-4 text-center leading-loose text-white lg:mt-10 lg:text-left lg:text-lg xl:text-xl">
            Triple Z Coffeeshop is an open rooftop café located at the heart of
            Barangay Palingon Tipas. The business owners intended to provide
            local residents with an alternative hangout featuring a unique
            variety of foods not common in the city’s culture.
          </p>

          {/* Button: centered on small, left-aligned on large */}
          <Link to={"/about"}>
            <Button
              variant="outline"
              size="lg"
              className="mx-auto mt-10 block border-white bg-transparent text-white lg:mx-0"
            >
              About Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Story;
