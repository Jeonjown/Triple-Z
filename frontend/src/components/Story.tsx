import { FC } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Story: FC = () => {
  return (
    // Section with a warm background color and padding
    <section className="overflow-hiddenpy-16 relative md:py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Flex container for image and text - reversed on medium screens */}
        <div className="flex flex-col items-center gap-12 md:flex-row-reverse lg:gap-16">
          {/* Image container - adjusted width and added relative positioning for potential overlap */}
          <div className="relative w-full md:w-1/2 lg:w-2/5">
            {/* Image with rounded corners and subtle shadow */}
            <img
              src="triple-z-clean.png" // Make sure this image path is correct
              alt="Triple Z Tarpaulin"
              className="h-auto w-full rounded-lg object-cover shadow-xl"
            />
            {/* Optional: Decorative element behind the image */}

            <div className="bg-primary-light absolute -left-4 -top-4 h-32 w-32 rounded-full opacity-50 mix-blend-multiply"></div>
          </div>

          {/* Text container - takes up remaining space, positioned for potential overlap on larger screens */}
          {/* Added a background color/shape here for visual interest */}
          <div className="relative z-10 w-full md:w-1/2 lg:w-3/5">
            {/* Positioned absolutely behind the text content */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary opacity-10 mix-blend-multiply blur-3xl filter md:h-96 md:w-96"></div>

            <div className="relative rounded-lg bg-white p-8 text-gray-800 shadow-lg md:p-10 lg:p-12">
              {" "}
              {/* Added a background to the text block */}
              {/* Header text */}
              <h2 className="mb-6 font-heading text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                The Story of Triple Z Coffee
              </h2>
              {/* Paragraph */}
              <p className="mb-8 leading-relaxed text-gray-700 lg:text-lg xl:text-xl">
                Triple Z Coffeeshop is an open rooftop café located at the heart
                of Barangay Palingon Tipas. Our founders set out to provide
                local residents with an alternative hangout featuring a unique
                variety of foods not common in the city’s culture.
              </p>
              {/* Button */}
              <Link to="/about">
                <Button
                  size="lg"
                  className="hover:bg-primary-darker bg-primary text-white shadow-md transition-transform duration-200" // Styled as a filled primary button
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
