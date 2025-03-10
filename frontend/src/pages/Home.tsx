import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import { Link } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useState, useEffect } from "react";
import {
  Calendar,
  CalendarCheck,
  MousePointerClick,
  ReceiptText,
} from "lucide-react";
import { useGetEventReservationSettings } from "@/features/Events/hooks/useGetEventReservationSettings";

import UserChat from "@/features/Chat/components/UserChat";

const Home = () => {
  const [itemsToShow, setItemsToShow] = useState(6);
  const { data: settings } = useGetEventReservationSettings();

  // Adjust item count based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(8);
      } else {
        setItemsToShow(6);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <section className="relative overflow-hidden">
        <div className="relative flex min-h-screen w-full flex-col items-center text-center lg:flex-row xl:items-center">
          {/* Background Image for Mobile (shifted down for 1:1 ratio) */}
          <img
            src="paper-background-mobile.png"
            alt="event background mobile"
            className="absolute h-full w-full object-cover object-[50%_50%] lg:top-40 xl:hidden"
          />

          {/* Background Image for XL (shifted right for 1:3 ratio) */}

          <img
            src="paper-background.png"
            alt="event pictures"
            className="absolute left-48 hidden h-full w-full object-cover object-[0%_50%] xl:block"
          />

          {/* Content */}
          <div className="relative z-10 px-5 py-10 sm:p-8 lg:max-w-prose xl:ml-20 xl:mr-auto xl:-translate-y-10">
            <h1 className="font-heading text-5xl font-light sm:text-6xl lg:text-7xl xl:mt-0">
              Welcome to Triple Z
            </h1>

            <h2 className="mt-6 text-lg sm:mt-5 sm:text-xl">
              Discover the perfect space to celebrate life’s special occasions
              at Triple Z Coffee. Reserve your spot today!
            </h2>
            <h3 className="my-5 text-base text-[#DFA593] sm:text-lg">
              MON-FRI {settings?.openingHours} - {settings?.closingHours}
            </h3>
            <Button
              size="lg"
              className="w-36 font-heading text-lg font-extralight sm:w-44"
            >
              Book Now!
            </Button>
          </div>
          <div className="z-10 flex w-full items-center justify-center">
            <img
              src="Triple-z-image.webp"
              alt="event background mobile"
              className="w-full max-w-sm md:top-10 md:max-w-lg lg:hidden lg:max-w-xl"
            />
            <img
              src="Triple-z-image.webp"
              alt="event background mobile"
              className="hidden w-full max-w-3xl lg:flex"
            />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="relative my-10 min-h-screen w-full">
        <UserChat />

        <h2 className="my-4 text-center font-heading text-4xl font-light">
          Featured Products
        </h2>
        <div className="relative mx-auto grid w-11/12 max-w-5xl grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {data &&
            data
              .sort(() => Math.random() - 0.5) // Shuffle items randomly
              .slice(0, 6) // Limit items
              .map((menuItem) => (
                <Link to={"/menu"} key={menuItem._id} className="mt-2 w-full">
                  <Card className="mx-auto h-full w-full max-w-lg border-none shadow-none">
                    <div className="">
                      <img
                        src={menuItem.image || "default-image.png"}
                        alt={menuItem.title}
                        className="mx-auto h-auto w-auto"
                      />
                    </div>

                    {/* Content Section (3x Flex) */}
                    <div className="">
                      <CardHeader className="p-0">
                        <CardTitle className="mt-1 text-center font-heading text-xl font-bold text-primary">
                          {menuItem.title}
                        </CardTitle>
                      </CardHeader>
                    </div>

                    {/* Price Section (1x Flex) */}
                    <div className="mt-2 text-center">
                      {menuItem.basePrice ? (
                        <div className="mx-auto text-xs">
                          ₱{menuItem.basePrice}
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          {menuItem.sizes?.map((size, index) => (
                            <div key={index} className="text-center">
                              <span className="block text-xs">{size.size}</span>
                              <span className="text-xs">₱{size.sizePrice}</span>
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

      {/* EVENTS */}
      <section className="relative min-h-screen px-4 py-10 lg:flex lg:items-center lg:justify-center">
        {/* Background Image */}
        <img
          src="BookNow-bg-1.png"
          alt="background"
          className="absolute inset-0 z-[-1] h-full w-full object-cover"
        />

        <div className="container mx-auto flex flex-col items-center gap-8 lg:flex-row lg:items-center">
          {/* Image Section (left on large, top on mobile) */}
          <div className="flex w-full justify-center lg:w-1/2">
            <img
              src="events-img.png"
              alt="events image"
              className="w-64 sm:w-80 lg:w-auto"
            />
          </div>

          <div className="hidden w-full text-left lg:block">
            <h2 className="text-lg font-semibold text-[#B89A82]">
              BE OUR GUEST
            </h2>
            <p className="font-heading text-5xl">How to Book a Reservation</p>
            <div className="mt-4">
              <div className="flex items-center space-x-1 p-4">
                {/* Icon Container */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                  <MousePointerClick className="!size-9 text-primary" />
                </div>
                {/* Text Container */}
                <div className="flex-grow p-2">
                  <h4 className="mb-2 font-heading text-lg">
                    Click "Book Now" or Go to Events
                  </h4>
                  <p>
                    On our homepage, click the "Book Now" button or navigate to
                    the "Events" section then click "Schedule."
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 p-4">
                {/* Icon Container */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                  <Calendar className="!size-9 text-primary" />
                </div>
                {/* Text Container */}
                <div className="flex-grow p-2">
                  <h4 className="mb-2 font-heading text-lg">
                    Choose a Date and Time
                  </h4>
                  <p>
                    Use the scheduling system to select your preferred date and
                    time.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 p-4">
                {/* Icon Container */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                  <ReceiptText className="!size-9 text-primary" />
                </div>
                {/* Text Container */}
                <div className="flex-grow p-2">
                  <h4 className="mb-2 font-heading text-lg">
                    Provide Event Details
                  </h4>
                  <p>
                    Enter your event type, the number of guests, and any special
                    requests.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 p-4">
                {/* Icon Container */}
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-xl">
                  <CalendarCheck className="!size-9 text-primary" />
                </div>
                {/* Text Container */}
                <div className="flex-grow p-2">
                  <h4 className="mb-2 font-heading text-lg">
                    Confirm Your Booking
                  </h4>
                  <p>
                    Review your details and click "Confirm Booking." You’ll
                    receive a confirmation email shortly!
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Button size="lg" className="mx-[30%] mt-10 block w-48">
                Book Now!
              </Button>
            </div>
          </div>

          {/* Text Section (right on large, bottom on mobile) */}
          <div className="w-full text-center lg:hidden lg:w-1/2 lg:text-left">
            <h2 className="font-heading text-2xl text-primary">BE OUR GUEST</h2>
            <p className="mt-2 max-w-prose font-heading text-3xl md:text-4xl">
              Reserve Your Spot for an Unforgettable Event Today
            </p>
            <p className="mt-5 text-xl">
              You deserve a good time with friends.
            </p>
            <p className="mt-5 font-semibold">
              {" "}
              MON-FRI {settings?.openingHours} - {settings?.closingHours}
            </p>
            <Button size="lg" className="mt-10">
              Book Now!
            </Button>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="relative my-20 min-h-screen w-full">
        <h2 className="my-4 text-center font-heading text-4xl font-light">
          Our Best Sellers
        </h2>
        <div className="relative mx-auto grid w-11/12 max-w-5xl grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
          {data &&
            data
              .sort(() => Math.random() - 0.5) // Shuffle items randomly
              .slice(0, itemsToShow) // Limit items
              .map((menuItem) => (
                <Link to={"/menu"} key={menuItem._id} className="w-full">
                  <Card className="mx-auto flex h-full w-full max-w-lg flex-row items-center p-5">
                    {/* Image Section (Fixed Width) */}
                    <div className="w-24 flex-shrink-0">
                      <img
                        src={menuItem.image || "default-image.png"}
                        alt={menuItem.title}
                        className="h-24 w-24 rounded-md object-cover"
                      />
                    </div>

                    {/* Content Section (3x Flex) */}
                    <div className="flex flex-[3] flex-col justify-between px-4">
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

                    {/* Price Section (1x Flex) */}
                    <div className="flex min-h-full flex-1 items-center border-l-4 border-primary pl-4 text-xl font-semibold text-primary">
                      {menuItem.basePrice ? (
                        <div className="mx-auto">₱{menuItem.basePrice}</div>
                      ) : (
                        <div className="flex flex-col items-center">
                          {menuItem.sizes?.map((size, index) => (
                            <div key={index} className="text-center">
                              <span className="block text-xs">{size.size}</span>
                              <span className="">₱{size.sizePrice}</span>
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
