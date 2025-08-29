import { FC, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "motion/react";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const AnimatedText: FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  ease?: number[];
}> = ({
  children,
  className,
  delay = 0.2,
  yOffset = 50,
  duration = 1,
  ease = [0, 0.71, 0.2, 1.01],
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const transition = {
    duration: duration,
    delay: delay,
    ease: ease,
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: transition,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Banner: FC = () => {
  const { data: settings } = useGetEventReservationSettings();

  const contentRef = useRef(null);
  const contentInView = useInView(contentRef, {
    once: true,
    margin: "0px 0px -10% 0px",
  });
  const contentControls = useAnimation();

  useEffect(() => {
    if (contentInView) {
      contentControls.start("visible");
    }
  }, [contentControls, contentInView]);

  const imageEntranceTransition = {
    duration: 1.5,
    delay: 0.5,
    ease: [0, 0.71, 0.2, 1.01],
  };

  const imageFloatTransition = {
    duration: 8,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  const imageRotateTransition = {
    duration: 12,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
    delay: 1,
  };

  return (
    <section className="relative overflow-hidden bg-amber-50">
      {" "}
      <div
        ref={contentRef}
        className="relative flex min-h-screen w-full flex-col items-center text-center lg:flex-row lg:text-left xl:items-center"
      >
        <div className="mx-auto w-full max-w-2xl px-10 sm:px-8 lg:mx-0 lg:w-1/2 lg:max-w-none lg:self-start lg:pr-12 xl:mt-24 xl:pl-24 xl:pr-16">
          {" "}
          <AnimatedText delay={0.3}>
            {" "}
            <h1 className="mt-10 font-heading text-5xl font-bold leading-tight text-text sm:text-5xl lg:text-6xl xl:text-9xl">
              Welcome to Triple Z Coffee Shop
            </h1>
          </AnimatedText>
          <AnimatedText delay={0.5}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-700 sm:mt-6 sm:text-xl">
              Discover the perfect space to celebrate life’s special occasions
              at Triple Z Coffee. Reserve your spot today!
            </p>
          </AnimatedText>
          {settings?.openingHours && settings?.closingHours && (
            <AnimatedText delay={0.7}>
              <p className="mt-5 text-xl font-semibold text-gray-800">
                MON-FRI {settings.openingHours} - {settings.closingHours}
              </p>
            </AnimatedText>
          )}
          <AnimatedText delay={0.9}>
            {" "}
            <div className="mt-10">
              {" "}
              <Link to="/schedule">
                <Button
                  size="lg"
                  className="w-full rounded-lg bg-primary font-heading text-lg font-semibold text-white transition-colors duration-200 hover:bg-primary sm:w-48"
                >
                  Book Now!
                </Button>
              </Link>
            </div>
          </AnimatedText>
        </div>
        <div className="relative z-10 flex w-full items-center justify-center p-6 lg:w-1/2 lg:flex-grow">
          <div className="absolute top-10 h-[1100px] w-[1100px] rounded-full bg-primary opacity-10 xl:-top-20 xl:rounded-r-lg"></div>
          <motion.div
            initial="hidden"
            animate={contentControls}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: {
                opacity: 1,
                scale: 1,
                y: [0, -15, 0],
                rotate: [0, 1, -1, 0],
                transition: {
                  opacity: imageEntranceTransition,
                  scale: imageEntranceTransition,
                  y: imageFloatTransition,
                  rotate: imageRotateTransition,
                },
              },
            }}
            className="h-auto w-full max-w-md md:max-w-lg lg:max-w-full"
          >
            <img
              src="/landing.webp"
              alt="Refreshing coffee drink with coffee beans scattered around"
              className="h-full w-full rounded-lg object-contain lg:object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
