// MissionVision.tsx
import { FC } from "react";

const MissionVision: FC = () => {
  return (
    <section className="max-w-8xl mx-auto my-10 rounded p-10 px-4 sm:px-6 lg:px-8">
      <div className="gap-8 p-5">
        {/* Mission Section */}
        <div className="flex flex-col justify-center p-5 text-center">
          <h2 className="text-sm text-primary md:text-base">Our Mission</h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Deliciously Crafted, Affordably Served
          </h3>
          <div className="mx-auto my-4 h-10 border-l-4 border-primary" />
          {/* Uniform loose paragraphs */}
          <p className="leading-loose">
            Our Mission is to provide quality and delicious freshly made foods
            and beverages at affordable prices.
          </p>
          <p className="mt-2 leading-loose">
            The aim of Triple Z is to ensure that our beloved customers are
            served with kindness and always satisfied.
          </p>
        </div>
        {/* Vision Section */}
        <div className="flex flex-col justify-center p-5 text-center">
          <h2 className="text-sm text-primary md:text-base">Our Vision</h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Bringing Authentic & Unique Flavors to Taguig
          </h3>
          <div className="mx-auto my-4 h-10 border-l-4 border-primary" />
          <p className="leading-loose">
            To be distinguished as one of the most respected and renowned
            coffeeshops locally.
          </p>
          <p className="mt-2 leading-loose">
            To serve unique drinks and produce authentic food available to
            consumers seeking distinctiveness.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
