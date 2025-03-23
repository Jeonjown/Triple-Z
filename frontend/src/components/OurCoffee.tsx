// OurCoffee.tsx
import { FC } from "react";

const OurCoffee: FC = () => {
  return (
    <section className="max-w-8xl mx-auto my-10 rounded p-10 px-4 sm:px-6 lg:px-8">
      {/* Grid: 1 column on mobile, 2 columns on larger screens */}
      <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-2">
        {/* Left Column: Image */}
        <div className="flex h-full w-full items-center justify-center">
          <img
            src="OurCoffee.png"
            alt="Coffee picture"
            className="h-full w-full object-cover"
          />
        </div>
        {/* Right Column: Text */}
        <div className="flex flex-col justify-center p-5 text-center lg:text-left">
          <h2 className="text-sm text-primary md:text-base">OUR COFFEE</h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Signature Blends Inspired by Tradition
          </h3>
          <hr className="mx-auto mt-5 w-20 border-2 border-primary lg:mx-0" />
          {/* Uniform loose paragraph */}
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
        </div>
      </div>
    </section>
  );
};

export default OurCoffee;
