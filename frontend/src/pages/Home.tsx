import UserChat from "@/features/Chat/components/UserChat";
import BeOurGuest from "@/components/BeOurGuest";
import Banner from "@/components/Banner";
import BlogCarousel from "@/components/BlogCarousel";
import EventPackages from "@/components/EventPackages";
import Story from "@/components/Story";
import VisitTripleZ from "@/components/VisitTripleZ";
// import BestSellers from "@/components/BestSellers";
// import FeaturedProducts from "@/components/FeaturedProducts";
const Home = () => {
  return (
    <>
      <div className="flex flex-col gap-10">
        <Banner />
        <BlogCarousel />
        <BeOurGuest />
        {/* <FeaturedProducts /> */}
        <EventPackages />
        {/* <BestSellers /> */}
        <Story />
        <VisitTripleZ />
        <UserChat />
      </div>
    </>
  );
};

export default Home;
