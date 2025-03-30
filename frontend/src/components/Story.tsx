import { FC } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Story: FC = () => {
  return (
    <section className="flex flex-col md:flex-row">
      {/* Image container taking equal space */}
      <div className="relative flex-1">
        <img
          src="triple-z-clean.png"
          alt="Triple Z Tarpaulin"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Text container with primary background and decorative SVG for PC */}
      <div className="relative flex flex-1 items-center justify-center bg-primary p-10">
        <div className="mx-auto max-w-3xl space-y-6 lg:pl-12">
          {/* Header text: centered on small, left-aligned on large */}
          <h2 className="mb-4 mt-5 text-center font-heading text-3xl font-bold text-white md:text-4xl lg:text-left lg:text-5xl">
            The Story of Triple Z Coffee
          </h2>
          {/* Paragraph: centered on small, left-aligned on large */}
          <p className="mt-4 text-center leading-relaxed text-white lg:mt-10 lg:text-left lg:text-lg xl:text-xl">
            Triple Z Coffeeshop is an open rooftop café located at the heart of
            Barangay Palingon Tipas. Our founders set out to provide local
            residents with an alternative hangout featuring a unique variety of
            foods not common in the city’s culture.
          </p>
          {/* Button: centered on small, left-aligned on large */}
          <Link to="/about">
            <Button
              variant="outline"
              size="lg"
              className="mx-auto mt-10 block border-white bg-transparent text-white transition-transform duration-200 hover:scale-105 hover:bg-white hover:text-primary lg:mx-0"
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
