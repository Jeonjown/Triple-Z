import UserChat from "@/features/Chat/components/UserChat";
import FeaturedProducts from "@/components/FeaturedProducts";
import BestSellers from "@/components/BestSellers";
import BeOurGuest from "@/components/BeOurGuest";
import Banner from "@/components/Banner";

const Home = () => {
  return (
    <>
      <Banner />
      <BeOurGuest />
      <FeaturedProducts />
      <BestSellers />
      <UserChat />
    </>
  );
};

export default Home;
