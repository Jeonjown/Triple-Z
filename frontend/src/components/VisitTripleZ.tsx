// VisitTripleZ.tsx
import { FC } from "react";
import { Button } from "./ui/button"; // Import your own Button component
import { Link } from "react-router-dom";

const VisitTripleZ: FC = () => {
  return (
    <section className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Grid layout: 1 column on mobile, 2 columns on larger screens */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Text Content with centered text on mobile and left-aligned on large screens */}
        <div className="text-center lg:text-left">
          <h2 className="text-xs font-semibold text-primary md:text-sm">
            Visit Triple Z Coffeeshop
          </h2>
          <h3 className="mt-2 font-heading text-xl md:text-2xl lg:text-3xl">
            Dine, Relax, and Enjoy
          </h3>
          <p className="mt-4 leading-loose">
            Triple Z Coffeeshop is located at 64 F. Manalo St. Palingon Tipas,
            Taguig. The map pin is at Palingon Barangay Hall, Taguig. We accept
            advance orders, walk-ins, or scheduled reservations. On-site dining
            and pickup are available, plus online delivery. Operating hours are
            from 4:00 PM to 10:00 PM, 7 days a week. Stay updated via our page!
          </p>
          <Link to={"/contacts"}>
            <Button className="mt-6">Contact Us!</Button>
          </Link>
        </div>

        {/* Right Column: Map or Image */}
        <div>
          {/* Replace src with your own Google Maps embed link or a static image */}
          <iframe
            title="Triple Z Coffeeshop Map"
            className="h-64 w-full border-0 sm:h-96"
            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&q=Triple+Z+Printing+and+Small+Cafe`}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default VisitTripleZ;
