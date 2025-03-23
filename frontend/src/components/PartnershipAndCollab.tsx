// PartnershipAndCollab.tsx
import { FC } from "react";

const PartnershipAndCollab: FC = () => {
  return (
    <section className="max-w-8xl mx-auto my-10 rounded p-10 px-4 sm:px-6 lg:px-8">
      {/* Grid: 1 column on mobile, 2 columns on larger screens */}
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
          {/* Uniform loose paragraph */}
          <p className="mt-8 leading-loose">
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
        <div className="flex h-full w-full items-center justify-center">
          <img
            src="PartnershipAndCollab.png"
            alt="Partnership picture"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default PartnershipAndCollab;
