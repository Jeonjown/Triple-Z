import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Banner = () => {
  const { data: settings } = useGetEventReservationSettings();
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative flex min-h-screen w-full flex-col items-center text-center lg:flex-row xl:items-center">
          {/* Background Image for Mobile (shifted down for 1:1 ratio) */}
          <img
            src="paper-background-mobile.png"
            alt="event background mobile"
            className="absolute h-full w-full object-cover object-[50%_50%] lg:top-40 xl:hidden"
          />

          {/* Background Image for XL (shifted right for 1:3 ratio) */}

          <img
            src="paper-background.png"
            alt="event pictures"
            className="absolute left-48 hidden h-full w-full object-cover object-[0%_50%] xl:block"
          />

          {/* Content */}
          <div className="relative z-10 px-5 py-10 sm:p-8 lg:max-w-prose xl:ml-20 xl:mr-auto xl:-translate-y-10">
            <h1 className="font-heading text-5xl font-light sm:text-6xl lg:text-7xl xl:mt-0">
              Welcome to Triple Z
            </h1>

            <h2 className="mt-6 text-lg sm:mt-5 sm:text-xl">
              Discover the perfect space to celebrate life’s special occasions
              at Triple Z Coffee. Reserve your spot today!
            </h2>
            <h3 className="my-5 text-base text-[#DFA593] sm:text-lg">
              MON-FRI {settings?.openingHours} - {settings?.closingHours}
            </h3>
            <Link to="/schedule">
              <Button
                size="lg"
                className="w-36 font-heading text-lg font-extralight sm:w-44"
              >
                Book Now!
              </Button>
            </Link>
          </div>
          <div className="z-10 flex w-full items-center justify-center">
            <img
              src="Triple-z-image.webp"
              alt="event background mobile"
              className="w-full max-w-sm md:top-10 md:max-w-lg lg:hidden lg:max-w-xl"
            />
            <img
              src="Triple-z-image.webp"
              alt="event background mobile"
              className="hidden w-full max-w-3xl lg:flex"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
