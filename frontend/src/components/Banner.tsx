import { FC, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "motion/react";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Banner: FC = () => {
  const { data: settings } = useGetEventReservationSettings();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true }); // Trigger animation only once when the element comes into view

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const transition = {
    duration: 1,
    delay: 0.3,
    ease: [0, 0.71, 0.2, 1.01],
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative flex min-h-screen w-full flex-col items-center text-center lg:flex-row xl:items-center">
        {/* Background Image for Mobile */}
        <img
          src="paper-background-mobile.png"
          alt="event background mobile"
          className="absolute h-full w-full object-cover object-[50%_50%] lg:top-40 xl:hidden"
        />

        {/* Background Image for XL */}
        <img
          src="paper-background.png"
          alt="event pictures"
          className="absolute left-48 hidden h-full w-full object-cover object-[0%_50%] xl:block"
        />

        {/* Content */}
        <div
          ref={ref}
          className="relative z-10 px-5 py-10 sm:p-8 lg:max-w-prose xl:ml-20 xl:mr-auto xl:-translate-y-10"
        >
          {/* Banner Header */}
          <motion.h1
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
            className="font-heading text-5xl font-light sm:text-6xl lg:text-7xl xl:mt-0 xl:text-8xl"
          >
            Welcome to Triple Z
          </motion.h1>

          {/* Subheading */}
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
            className="mt-6 text-lg sm:mt-5 sm:text-xl"
          >
            Discover the perfect space to celebrate life’s special occasions at
            Triple Z Coffee. Reserve your spot today!
          </motion.h2>

          {/* Opening Hours */}
          <motion.h3
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
            className="my-5 text-base text-[#DFA593] sm:text-lg"
          >
            MON-FRI {settings?.openingHours} - {settings?.closingHours}
          </motion.h3>

          {/* Button */}
          <motion.div
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
          >
            <Link to="/schedule">
              <Button
                size="lg"
                className="w-36 font-heading text-lg font-extralight sm:w-44"
              >
                Book Now!
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Image Section */}
        <div className="z-10 flex w-full items-center justify-center">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { scale: 0.7 },
              visible: { scale: 1.0, transition: transition },
            }}
            className="flex h-full w-full items-center justify-center"
          >
            <img
              src="Triple-z-image.webp"
              alt="event background mobile"
              className="w-full max-w-sm md:top-10 md:max-w-lg lg:hidden lg:max-w-xl"
            />
            <img
              src="Triple-z-image.webp"
              alt="event background mobile"
              className="hidden w-full max-w-4xl lg:flex"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
