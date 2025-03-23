// OurStory.tsx
import { FC } from "react";

const OurStory: FC = () => {
  return (
    <section className="mx-auto my-10 max-w-7xl rounded p-10 px-4 sm:px-6 lg:px-8">
      <div className="gap-8 p-5">
        <div className="flex flex-col justify-center p-5 text-center">
          <h2 className="text-sm text-primary md:text-base">Our Story</h2>
          <h3 className="mt-2 font-heading text-3xl md:text-3xl lg:text-4xl">
            Brewing Tradition, Creating Connections
          </h3>
          <div className="mx-auto my-4 h-10 border-l-4 border-primary" />
          {/* Uniform loose paragraph */}
          <p className="mt-2 leading-loose">
            Way back 2020 before the lockdown due to Covid 19 was announced, the
            owner of TripleZ went for a vacation in Mindanao where they got
            interested in starting a buy and sell of locally produced ground
            coffee from the highland municipality of Danag Patikul Sulu, from
            there they took the opportunity of introducing Alih Kape brand a
            robusta bean ground coffee that they marketed online thru shoppee
            and fb market place, the Alih Kape was also patronized in some
            Muslim grocery stores. After the lockdown and ECQ the coffee
            industries begun to flourish as the opening of physical stores
            restarted to become competent again in the market. In March of 2023
            Triple Z coffeeshop was opened to the public, inspired after the
            initials of the three beloved daughter of the owners Zia, Zaily and
            Zarina.
          </p>
          <p className="mt-2 leading-loose">
            Making Alih Kape brand at the heart of its coffeebeans Triple Z
            coffeeshop was know for brewing quality caffeinated drinks that are
            on trend but is offered in affordable prices. In order to make
            Triple Z coffeeshop a more unique café it was not only exclusive for
            caffeinated drinks but provided lots of variety of choices for its
            customers. Milk based flavored lava drinks and organic Tea are on
            its popular beverages too. To match up the drinks an Authentic
            Arabic Shawarma is its best seller snack. The name AbuZia Shawarma
            is used to popularize the TripleZ shawarma originated from Riyadh
            street food. The taste, the sauce and vibes of Abuzia Shawarma is a
            very distinguished favorite of expat customers and regular
            consumers. In addition, as Triple Z grew more appealing to its
            regular customers the rooftop garden setup became a cozy place of
            hangout for group meetings, gathering and relaxations. Given the
            wide space that can occupy good for 30 to 50 person Triple Z
            upgraded to be an events place too that accomodated parties and
            special occassions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
