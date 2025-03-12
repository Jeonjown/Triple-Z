import {
  MousePointerClick,
  Calendar,
  ReceiptText,
  CalendarCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const BeOurGuest = () => {
  return (
    <section className="relative min-h-screen px-4 py-10 lg:flex lg:items-center lg:justify-center">
      {/* Background Image */}
      {/* <img
        src="BookNow-bg-1.png"
        alt="background"
        className="absolute inset-0 z-[-1] h-full w-full object-cover"
      /> */}

      <div className="container mx-auto flex flex-col items-center gap-8 px-4 lg:flex-row lg:items-center">
        {/* Image Section */}
        <div className="flex w-full justify-center lg:w-1/2">
          <img
            src="be-our-guest-photo.png"
            alt="events image"
            className="w-64 sm:w-80 lg:w-auto"
          />
        </div>

        {/* Combined Text Section */}
        <div className="w-full text-left lg:text-left">
          {/* Header */}
          <h2 className="text-center text-lg font-semibold text-[#B89A82] lg:text-left">
            BE OUR GUEST
          </h2>
          <p className="text-center font-heading text-5xl lg:text-left">
            How to Book a Reservation
          </p>

          {/* Instruction Items */}
          <div className="mt-4">
            {/* Instruction 1 */}
            <div className="flex items-center space-x-2 p-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <MousePointerClick className="!size-9 text-primary" />
              </div>
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
            {/* Instruction 2 */}
            <div className="flex items-center space-x-2 p-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <Calendar className="!size-9 text-primary" />
              </div>
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
            {/* Instruction 3 */}
            <div className="flex items-center space-x-2 p-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <ReceiptText className="!size-9 text-primary" />
              </div>
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
            {/* Instruction 4 */}
            <div className="flex items-center space-x-2 p-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                <CalendarCheck className="!size-9 text-primary" />
              </div>
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

          {/* Call-to-action Button */}
          <div>
            <Link to="/schedule">
              <Button size="lg" className="mx-auto mt-10 block w-48">
                Book Now!
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeOurGuest;
