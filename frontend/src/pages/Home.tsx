import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <section className="overflow-hidden sm:bg-red-500">
      <div className="relative min-h-screen w-full text-center">
        {/* Background Image */}
        <img
          src="paper-background-mobile.png"
          alt="event pictures"
          className="absolute bottom-10 left-0 h-full w-full object-cover"
        />

        {/* Content */}
        <div className="relative z-10 px-5 py-10 sm:p-8">
          <h1 className="font-heading text-5xl font-light">
            Welcome to Triple Z
          </h1>
          <h2 className="mt-5 text-lg sm:mt-5 sm:text-xl">
            Discover the perfect space to celebrate life’s special occasions at
            Triple Z Coffee. Reserve your spot today!
          </h2>
          <h3 className="py-4 text-base text-[#DFA593] sm:text-lg">
            MON-FRI 4:00 PM - 10:00 PM
          </h3>
          <Button
            size="lg"
            className="w-36 font-heading text-lg font-extralight sm:w-44"
          >
            Book Now!
          </Button>
        </div>

        {/* Centered Hero Image */}
        <img
          src="Triple-z-hero-page-pic.png"
          alt="events image"
          className="absolute left-1/2 w-[90%] max-w-lg -translate-x-1/2"
        />
      </div>
    </section>
  );
};

export default Home;
