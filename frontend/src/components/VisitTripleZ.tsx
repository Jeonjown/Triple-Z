import { FC } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const VisitTripleZ: FC = () => {
  return (
    <section className="mx-auto my-20 max-w-7xl rounded p-10 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-5 text-center lg:text-left">
          <h2 className="text-sm font-semibold text-primary md:text-base">
            Visit Triple Z Coffeeshop
          </h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Dine, Relax, and Enjoy
          </h3>
          <hr className="mx-auto mt-5 w-20 border-2 border-primary lg:mx-0" />
          <p className="mt-8 leading-loose lg:text-lg">
            Triple Z Coffeeshop is located at 64 F. Manalo St. Palingon Tipas,
            Taguig. The map pin is at Palingon Barangay Hall, Taguig. We accept
            advance orders, walk-ins, or scheduled reservations. On-site dining
            and pickup are available, plus online delivery. Operating hours are
            from 4:00 PM to 10:00 PM, 7 days a week. Stay updated via our page!
          </p>
          <Link to={"/contacts"}>
            <Button className="mt-10 text-lg">Contact Us!</Button>
          </Link>
        </div>

        <div className="mt-10 md:mt-0">
          <iframe
            title="Triple Z Coffeeshop Map"
            className="h-80 w-full border-0 sm:h-[30rem]"
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
