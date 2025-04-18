// PartnershipAndCollab.tsx
import { FC, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "motion/react";

const PartnershipAndCollab: FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true }); // Use 'once' instead of 'triggerOnce'

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const transition = {
    duration: 0.8,
    delay: 0.5,
    ease: [0, 0.71, 0.2, 1.01],
  };

  return (
    <section className="mx-auto my-10 max-w-7xl rounded p-10 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-2">
        {/* Left Column: Text */}
        <div className="flex flex-col justify-center p-5 text-center lg:text-left">
          <h2 className="text-sm text-primary md:text-base">
            Partnership and Collaborations
          </h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Collaborate, Create, and Grow with Triple Z
          </h3>
          <hr className="mx-auto mt-5 w-20 border-2 border-primary lg:mx-0" />
          <p className="relative mt-8 leading-loose">
            Triple Z Coffeeshop welcomes students and groups interested in using
            the café as a subject of study. It also supports groups with
            marketing opportunities and potential business expansion ideas.
            Since 2023, Triple Z has engaged with students from TCU, STI BGC,
            and RTU for research projects and programs. The coffeeshop is also
            recognized by local choral groups, theater artists, and dance
            communities.
          </p>
        </div>
        {/* Right Column: Image */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { scale: 1 },
            visible: { scale: 1.1, transition: transition },
          }}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src="PartnershipAndCollab.png"
            alt="Partnership picture"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PartnershipAndCollab;
