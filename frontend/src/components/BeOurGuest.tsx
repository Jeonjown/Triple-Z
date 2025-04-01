import { motion, useAnimation, useInView } from "motion/react"; // Import motion components
import {
  MousePointerClick,
  Calendar,
  ReceiptText,
  CalendarCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";

const BeOurGuest = () => {
  const controls = useAnimation(); // Initialize animation controls
  const ref = useRef(null); // Reference for the section element
  const inView = useInView(ref, { once: true }); // Trigger animation once when the element is in view

  // Trigger the animation when the section is in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Define transition details
  const transition = {
    duration: 0.8,
    delay: 1,
    ease: [0, 0.71, 0.2, 1.01],
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-4 py-10 lg:flex lg:items-center lg:justify-center"
    >
      {/* Background Image */}
      {/* <img
        src="BookNow-bg-1.png"
        alt="background"
        className="absolute inset-0 z-[-1] h-full w-full object-cover opacity-50"
      /> */}

      <div className="container mx-auto flex flex-col items-center gap-8 px-4 lg:flex-row lg:items-center">
        {/* Image Section */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -50 },
            visible: { opacity: 1, y: 0, transition },
          }}
          className="flex w-full justify-center lg:w-1/2"
        >
          <img
            src="be-our-guest-photo.png"
            alt="events image"
            className="w-64 sm:w-80 lg:w-auto"
          />
        </motion.div>

        {/* Combined Text Section */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { ...transition, delay: 0.2 },
            },
          }}
          className="w-full text-left lg:text-left"
        >
          <motion.h2
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: -50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { ...transition, delay: 0.4 },
              },
            }}
            className="text-center text-lg font-semibold text-[#B89A82] lg:text-left"
          >
            BE OUR GUEST
          </motion.h2>
          <motion.p
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: -50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { ...transition, delay: 0.6 },
              },
            }}
            className="text-center font-heading text-5xl lg:text-left"
          >
            How to Book a Reservation
          </motion.p>

          <div className="mt-4">
            {/* Instruction 1 */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: -50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { ...transition, delay: 0.8 },
                },
              }}
              className="flex items-center space-x-2 p-4"
            >
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
            </motion.div>

            {/* Instruction 2 */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: -50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { ...transition, delay: 1.0 },
                },
              }}
              className="flex items-center space-x-2 p-4"
            >
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
            </motion.div>

            {/* Instruction 3 */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: -50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { ...transition, delay: 1.2 },
                },
              }}
              className="flex items-center space-x-2 p-4"
            >
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
            </motion.div>

            {/* Instruction 4 */}
            <motion.div
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: -50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { ...transition, delay: 1.4 },
                },
              }}
              className="flex items-center space-x-2 p-4"
            >
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
            </motion.div>
          </div>

          {/* Call-to-action Button */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: -50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { ...transition, delay: 1.6 },
              },
            }}
          >
            <Link to="/schedule">
              <Button size="lg" className="mx-auto mt-10 block w-48">
                Book Now!
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BeOurGuest;
