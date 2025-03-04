import Login from "../../Auth/pages/Login";
import useAuthStore from "../../Auth/stores/useAuthStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Schedule = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Login text="Please login first" destination="/schedule" />;
  }

  return (
    <>
      <div className="relative mx-auto mt-10 flex min-h-screen flex-col items-center text-center">
        <h2 className="mb-2 font-heading text-2xl">Choose Event Type</h2>
        <p className="mb-6">
          Select the event type that best suits your needs and book your spot
          hassle-free!
        </p>

        {/* Responsive Card Container */}
        <div className="z-10 mx-5 mb-10 flex flex-col gap-6 md:flex-row md:justify-center md:gap-10">
          {/* Groups Card */}
          <Card className="flex w-full flex-col p-10 md:w-[45%] md:shadow-md lg:w-[40%]">
            <CardHeader>
              <CardTitle>
                <img
                  src="groups.png"
                  alt="groups event pic"
                  className="mx-auto"
                />
              </CardTitle>
              <CardDescription className="text-lg font-semibold">
                GROUPS
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="max-w-prose list-disc pl-4 text-left text-sm sm:text-base">
                <li>For: 6 - 12 persons</li>
                <li>
                  Best for: Small gatherings, casual meetups, or family dinners
                </li>
                <li>
                  Booking requirement: Must be reserved at least 24 hours in
                  advance
                </li>
                <li>
                  Availability: Based on open table slots; no exclusive use of
                  the venue
                </li>
                <li>Other guests may be present</li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto flex justify-center">
              <Button variant={"outline"} className="w-full">
                Select
              </Button>
            </CardFooter>
          </Card>

          {/* Events Card */}
          <Card className="flex w-full flex-col p-10 md:w-[45%] md:shadow-md lg:w-[40%]">
            <CardHeader>
              <CardTitle>
                <img
                  src="events.png"
                  alt="events event pic"
                  className="mx-auto"
                />
              </CardTitle>
              <CardDescription className="text-lg font-semibold">
                EVENTS
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="max-w-prose list-disc pl-4 text-left text-sm sm:text-base">
                <li>For: 24 - 60 persons</li>
                <li>
                  Best for: Large group gatherings, corporate events, or
                  celebrations
                </li>
                <li>
                  Booking requirement: Must be scheduled at least 2 weeks in
                  advance
                </li>
                <li>
                  Includes: Catering, decorations, exclusive/private venue use
                </li>
                <li>Requires: Custom event planning & coordination</li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto flex justify-center">
              <Button variant={"outline"} className="w-full">
                Select
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Background Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 w-full bg-primary sm:h-[40%] md:h-[50%]"></div>
      </div>
    </>
  );
};

export default Schedule;
