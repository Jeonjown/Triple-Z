import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useFetchAllMenuItems from "@/features/admin/features/manage menu/hooks/useFetchAllMenuItems";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";

const Home = () => {
  const { data, isPending, isError, error } = useFetchAllMenuItems();

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <ErrorPage message={error?.message} statusCode={error?.statusCode} />
    );
  }

  if (data?.length === 0) {
    return "No Menu Items";
  }

  return (
    <>
      {/* HEADER */}
      <section className="relative overflow-hidden sm:bg-red-500 md:bg-blue-400 lg:bg-green-400">
        <div className="relative min-h-screen w-full text-center">
          {/* Background Image */}
          <img
            src="paper-background-mobile.png"
            alt="event pictures"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Content */}
          <div className="relative px-5 py-10 sm:p-8">
            <h1 className="font-heading text-6xl font-light">
              Welcome to Triple Z
            </h1>
            <h2 className="mt-8 text-lg sm:mt-5 sm:text-xl">
              Discover the perfect space to celebrate life’s special occasions
              at Triple Z Coffee. Reserve your spot today!
            </h2>
            <h3 className="my-5 text-base text-[#DFA593] sm:text-lg">
              MON-FRI 4:00 PM - 10:00 PM
            </h3>
            <Button
              size="lg"
              className="w-36 font-heading text-lg font-extralight sm:w-44"
            >
              Book Now!
            </Button>
          </div>

          {/* Centered Hero Image */}
          <img
            src="Triple-z-hero-page-pic.png"
            alt="events image"
            className="bottom-30 absolute left-1/2 w-[90%] max-w-lg -translate-x-1/2"
          />
        </div>
      </section>

      {/* EVENTS */}
      <section className="relative flex h-screen flex-col items-center">
        {/* Background Image */}
        <img
          src="BookNow-bg-1.png"
          alt="background"
          className="absolute inset-0 z-[-1] h-full w-full object-cover"
        />

        {/* Content Wrapper */}
        <div className="">
          {/* Image - Left Aligned on larger screens */}
          <img
            src="events-img.png"
            alt="events image"
            className="mx-auto mt-20 w-64"
          />

          {/* Text - Always Centered */}
          <div className="mx-6 text-center">
            <h2 className="mt-10 font-heading text-3xl text-primary">
              BE OUR GUEST
            </h2>
            <p className="mt-5 font-heading text-5xl">
              Reserve Your Spot for an Unforgettable Event Today
            </p>
            <p className="mt-5 text-xl">
              You deserve a good time with friends.
            </p>
            <p className="mt-5 font-semibold">MON-FRI: 4:00 PM - 10:00 pm</p>
            <Button size={"lg"} className="mt-10">
              Book Now!
            </Button>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="relative mb-36 w-screen">
        <h2 className="my-4 text-center font-heading text-4xl font-light">
          Our Best Sellers
        </h2>
        <div className="mx-auto grid w-11/12 max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {data &&
            data
              .sort(() => Math.random() - 0.5) // Shuffle items randomly
              .slice(0, 6) // Limit to 6 items
              .map((menuItem) => (
                <Link to={"/menu"} key={menuItem._id} className="w-full">
                  <Card className="mx-auto flex h-full w-full max-w-lg flex-row items-center p-5 shadow-md">
                    {/* Image Section */}
                    <div className="flex-shrink-0">
                      <img
                        src={menuItem.image || "default-image.png"}
                        alt={menuItem.title}
                        className="h-24 w-24 rounded-md object-cover"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-1 flex-col justify-between px-4">
                      <CardHeader className="p-0">
                        <CardTitle className="text-xl font-bold">
                          {menuItem.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {menuItem.categoryName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 text-sm">
                        <p className="line-clamp-2">{menuItem.description}</p>
                      </CardContent>
                    </div>

                    {/* Price Section */}
                    <div className="flex min-h-full items-center border-l-4 border-primary pl-4 text-xl font-semibold text-primary">
                      {menuItem.basePrice ? (
                        <div>₱{menuItem.basePrice}</div>
                      ) : (
                        <div className="flex flex-col items-center">
                          {menuItem.sizes?.map((size, index) => (
                            <div key={index} className="text-center">
                              <span className="block text-xs">{size.size}</span>
                              <span>₱{size.sizePrice}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
        </div>
      </section>
    </>
  );
};

export default Home;
