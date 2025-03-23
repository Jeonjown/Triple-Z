// AboutTheCompany.tsx
import { FC } from "react";

const AboutTheCompany: FC = () => {
  return (
    <section className="mx-auto max-w-7xl rounded p-10 px-4 sm:px-6 lg:my-20 lg:px-8">
      {/* Grid: 1 column on mobile, 2 columns on larger screens */}
      <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-2">
        {/* Left Column: Text */}
        <div className="flex flex-col justify-center p-5 text-center lg:text-left">
          <h2 className="text-sm text-primary md:text-base">
            About The Company
          </h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Crafting <span className="italic">Connections</span> Over Every Cup
          </h3>
          <hr className="mx-auto mt-5 w-20 border-2 border-primary lg:mx-0" />
          {/* Paragraph with uniform loose spacing */}
          <p className="mt-8 leading-loose">
            Triple Z Coffeeshop is owned by the married couple Mr. Emmanuel and
            Mrs. Sherwida Ramos, who are both degree holders with professional
            experience in their respective fields. Noel is a native of Tipas
            Taguig, and Weng is from Maharlika Village with family roots in the
            Tausug Tribe of Jolo Mindanao. Noel is a retired corporate employee
            who became an entrepreneur owning and managing Gardenise Mineral
            Water and refilling station, as well as running a vapeshop and
            perfume store online. Weng was a former OFW in the Middle East. Both
            are coffee lovers and food enthusiasts. The idea of Triple Z
            Coffeeshop and AbuZia Shawarma is born out of their common
            interests.
          </p>
        </div>
        {/* Right Column: Image */}
        <div className="flex h-full w-full items-center justify-center">
          <img
            src="family.png"
            alt="Family picture"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutTheCompany;
