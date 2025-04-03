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
import { Link } from "react-router-dom";
import {
  UsersIcon,
  CalendarIcon,
  UserRoundIcon,
  ClockIcon,
  EyeIcon,
  UserPlusIcon,
  BuildingIcon,
  UtensilsIcon,
  GiftIcon,
  WrenchIcon,
} from "lucide-react"; // Import all necessary icons

const Schedule = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Login text="Please login first" destination="/schedule" />;
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container relative mx-auto px-4">
        {/* Hero Section with a more modern feel */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 font-heading text-5xl font-bold text-primary">
            Plan Your Perfect Event
          </h2>
          <p className="mb-10 text-xl text-gray-700 sm:text-2xl">
            Effortlessly schedule and book the ideal event experience for your
            needs.
          </p>
        </div>

        {/* Improved Responsive Card Container with better spacing and animations */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Groups Card */}
          <Card className="group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <CardHeader className="flex flex-col items-center justify-center p-8">
              <div className="relative mb-4 flex h-48 w-48 items-center justify-center rounded-full bg-primary/10 text-primary">
                <img
                  src="groups.png"
                  alt="groups event pic"
                  className="max-w-48"
                />
              </div>

              <CardTitle className="mt-2 text-center text-3xl font-semibold text-primary">
                Groups
              </CardTitle>
              <CardDescription className="mt-2 text-center text-gray-600">
                Small Gatherings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="max-w-prose space-y-4 text-lg text-gray-700">
                <li className="flex items-center">
                  <UsersIcon className="mr-2 !size-5 text-primary" />
                  For: 6 - 12 persons
                </li>
                <li className="flex items-center">
                  <UserRoundIcon className="mr-2 !size-8 text-primary" />
                  Best for: Small gatherings, casual meetups, or family dinners
                </li>
                <li className="flex items-center">
                  <CalendarIcon className="mr-2 !size-8 text-primary" />
                  Booking requirement: Must be reserved at least 24 hours in
                  advance
                </li>
                <li className="flex items-center">
                  <ClockIcon className="mr-2 !size-8 text-primary" />
                  Availability: Based on open table slots; no exclusive use of
                  the venue
                </li>
                <li className="flex items-center">
                  <EyeIcon className="mr-2 !size-5 text-primary" />
                  Other guests may be present
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto flex flex-col justify-end p-8">
              <Link
                to={`/schedule/group-form/${user._id}`}
                className="block w-full"
              >
                <Button className="mt-auto w-full bg-primary text-lg font-medium text-white transition-colors duration-300 hover:bg-primary/80 focus:ring-primary">
                  Book Now
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Events Card */}
          <Card className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            <CardHeader className="flex flex-col items-center justify-center p-8">
              <div className="relative mb-4 flex h-48 w-48 items-center justify-center rounded-full bg-primary/10 text-primary">
                <img
                  src="events.png"
                  alt="events event pic"
                  className="max-w-48"
                />
              </div>

              <CardTitle className="mt-2 text-center text-3xl font-semibold text-primary">
                Events
              </CardTitle>
              <CardDescription className="mt-2 text-center text-gray-600">
                Large Group Gatherings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="max-w-prose space-y-4 text-lg text-gray-700">
                <li className="flex items-center">
                  <UserPlusIcon className="mr-2 !size-5 text-primary" />
                  For: 24 - 60 persons
                </li>
                <li className="flex items-center">
                  <BuildingIcon className="m:w-6 mr-2 !size-8 text-primary" />
                  Best for: Large group gatherings, corporate events, or
                  celebrations
                </li>
                <li className="flex items-center">
                  <CalendarIcon className="mr-2 !size-8 text-primary" />
                  Booking requirement: Must be scheduled at least 2 weeks in
                  advance
                </li>
                <li className="flex items-center">
                  <UtensilsIcon className="mr-2 !size-5 text-primary" />
                  Includes: Catering
                </li>
                <li className="flex items-center">
                  <GiftIcon className="mr-2 !size-5 text-primary" />
                  Includes: Decorations
                </li>
                <li className="flex items-center">
                  <UsersIcon className="mr-2 !size-5 text-primary" />
                  Includes: Exclusive/private venue use
                </li>
                <li className="flex items-center">
                  <WrenchIcon className="mr-2 !size-5 text-primary" />
                  Requires: Custom event planning & coordination
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto flex flex-col justify-end p-8">
              <Link
                to={`/schedule/event-form/${user._id}`}
                className="block w-full"
              >
                <Button className="mt-auto w-full bg-primary text-lg font-medium text-white transition-colors duration-300 hover:bg-primary/80 focus:ring-primary">
                  Book Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
