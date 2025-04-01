import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef } from "react";

const OurCoffee = () => {
  // Initialize animation controls
  const controls = useAnimation();
  // Create a ref for the section element
  const ref = useRef(null);
  // Determine if the section is in view
  const inView = useInView(ref, { once: true });

  // Trigger animations when the section comes into view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Define animation variants for the section
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Define animation variants for the image
  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.3 } },
  };

  // Define animation variants for the text
  const textVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.3 } },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      className="mx-auto max-w-full rounded px-4 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-2">
        {/* Left Column: Image */}
        <motion.div
          variants={imageVariants}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src="OurCoffee.png"
            alt="Coffee picture"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Right Column: Text */}
        <motion.div
          variants={textVariants}
          className="flex flex-col justify-center p-5 text-center lg:text-left"
        >
          <h2 className="text-sm text-primary md:text-base">OUR COFFEE</h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Signature Blends Inspired by Tradition
          </h3>
          <hr className="mx-auto mt-5 w-20 border-2 border-primary lg:mx-0" />
          <p className="mt-8 leading-loose">
            Alih Kape is the heart of Triple Z Coffeeshop, featuring rich and
            bold Robusta beans sourced from the highlands of Danag, Patikul,
            Sulu. Originally introduced through online platforms and local
            Muslim grocery stores, Alih Kape quickly gained recognition for its
            strong, full-bodied flavor. As coffee culture flourished
            post-pandemic, it became the foundation of Triple Z’s signature
            brews, offering an authentic and aromatic coffee experience at an
            affordable price.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurCoffee;
