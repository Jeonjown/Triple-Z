import {
  MousePointerClick,
  Calendar,
  ReceiptText,
  CalendarCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";

const BeOurGuest = () => {
  const { data: settings } = useGetEventReservationSettings();
  return (
    <section className="relative min-h-screen px-4 py-10 lg:flex lg:items-center lg:justify-center">
      {/* Background Image */}
      <img
        src="BookNow-bg-1.png"
        alt="background"
        className="absolute inset-0 z-[-1] h-full w-full object-cover"
      />

      <div className="container mx-auto flex flex-col items-center gap-8 lg:flex-row lg:items-center">
        {/* Image Section (left on large, top on mobile) */}
        <div className="flex w-full justify-center lg:w-1/2">
          <img
            src="events-img.png"
            alt="events image"
            className="w-64 sm:w-80 lg:w-auto"
          />
        </div>

        <div className="hidden w-full text-left lg:block">
          <h2 className="text-lg font-semibold text-[#B89A82]">BE OUR GUEST</h2>
          <p className="font-heading text-5xl">How to Book a Reservation</p>
          <div className="mt-4">
            <div className="flex items-center space-x-1 p-4">
              {/* Icon Container */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <MousePointerClick className="!size-9 text-primary" />
              </div>
              {/* Text Container */}
              <div className="flex-grow p-2">
                <h4 className="mb-2 font-heading text-lg">
                  Click "Book Now" or Go to Events
                </h4>
                <p>
                  On our homepage, click the "Book Now" button or navigate to
                  the "Events" section then click "Schedule."
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 p-4">
              {/* Icon Container */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <Calendar className="!size-9 text-primary" />
              </div>
              {/* Text Container */}
              <div className="flex-grow p-2">
                <h4 className="mb-2 font-heading text-lg">
                  Choose a Date and Time
                </h4>
                <p>
                  Use the scheduling system to select your preferred date and
                  time.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 p-4">
              {/* Icon Container */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <ReceiptText className="!size-9 text-primary" />
              </div>
              {/* Text Container */}
              <div className="flex-grow p-2">
                <h4 className="mb-2 font-heading text-lg">
                  Provide Event Details
                </h4>
                <p>
                  Enter your event type, the number of guests, and any special
                  requests.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 p-4">
              {/* Icon Container */}
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <CalendarCheck className="!size-9 text-primary" />
              </div>
              {/* Text Container */}
              <div className="flex-grow p-2">
                <h4 className="mb-2 font-heading text-lg">
                  Confirm Your Booking
                </h4>
                <p>
                  Review your details and click "Confirm Booking." You’ll
                  receive a confirmation email shortly!
                </p>
              </div>
            </div>
          </div>
          <div>
            <Button size="lg" className="mx-[30%] mt-10 block w-48">
              Book Now!
            </Button>
          </div>
        </div>

        {/* Text Section (right on large, bottom on mobile) */}
        <div className="w-full text-center lg:hidden lg:w-1/2 lg:text-left">
          <h2 className="font-heading text-2xl text-primary">BE OUR GUEST</h2>
          <p className="mt-2 max-w-prose font-heading text-3xl md:text-4xl">
            Reserve Your Spot for an Unforgettable Event Today
          </p>
          <p className="mt-5 text-xl">You deserve a good time with friends.</p>
          <p className="mt-5 font-semibold">
            {" "}
            MON-FRI {settings?.openingHours} - {settings?.closingHours}
          </p>
          <Button size="lg" className="mt-10">
            Book Now!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BeOurGuest;
