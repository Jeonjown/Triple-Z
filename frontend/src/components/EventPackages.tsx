import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import LoadingPage from "@/pages/LoadingPage";
import ErrorPage from "@/pages/ErrorPage";

const EventPackages: React.FC = () => {
  // Fetch menu items using a custom hook
  const { data, isPending, isError, error } = useFetchAllMenuItems();

  // State for carousel API with explicit type
  const [api, setApi] = useState<CarouselApi | null>(null);

  // Dot button control hook, passing api explicitly
  const { selectedIndex, scrollSnaps, onDotButtonClick, updateSelectedIndex } =
    useDotButton(api || undefined);

  // Removed tweenOpacity: no opacity changes applied

  // Register and cleanup carousel event listeners (only updating selected index)
  useEffect(() => {
    if (!api) return;
    updateSelectedIndex(); // Set initial selected index
    api.on("scroll", updateSelectedIndex);
    return () => {
      api.off("scroll", updateSelectedIndex);
    };
  }, [api, updateSelectedIndex]);

  // Handle loading and error states
  if (isPending) return <LoadingPage />;
  if (isError)
    return (
      <ErrorPage message={error?.message} statusCode={error?.statusCode} />
    );

  // Filter for Event Meals from fetched data
  const eventMeals =
    data?.filter((item) => item.subcategoryName === "Event Meals") || [];

  return (
    <section className="my-10 w-full">
      <div className="text-center">
        <h2 className="text-xs font-semibold text-primary md:text-sm">
          EVENT PACKAGES
        </h2>
        <p className="font-heading text-xl md:text-2xl lg:text-3xl">
          Explore Our Event Packages
        </p>
      </div>

      {/* Increased container max-width on LG screens for larger carousel items */}
      <div className="mx-auto max-w-4xl lg:max-w-7xl">
        <Carousel
          opts={{ align: "center", loop: true }}
          plugins={[Autoplay({ delay: 3000 })]}
          setApi={setApi}
          className="mt-5 w-full"
        >
          <CarouselContent style={{ gap: "30px" }}>
            {eventMeals.map((meal) => (
              // Responsive item: 60% width on small screens, 33.33% on LG screens
              <CarouselItem
                key={meal._id}
                className="flex-shrink-0 basis-[60%] lg:basis-1/3"
              >
                <Card className="h-full w-full border-none shadow-none">
                  <img
                    src={meal.image || "default-image.png"}
                    alt={meal.title}
                    className="h-auto w-full object-cover"
                  />
                  <CardHeader className="p-2">
                    <CardTitle className="text-center font-heading text-xl text-primary">
                      {meal.title}
                    </CardTitle>
                  </CardHeader>
                  <div className="mt-1 text-center">
                    {meal.basePrice ? (
                      <span className="block text-sm">₱{meal.basePrice}</span>
                    ) : (
                      <div className="flex justify-center gap-2 text-sm">
                        {meal.sizes?.map(
                          (size: { size: string; sizePrice: number }) => (
                            <div key={size.size}>
                              {size.size} - ₱{size.sizePrice}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="mt-4 flex justify-center">
        {/* Dot navigation buttons */}
        {scrollSnaps.map((_, index: number) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={`mx-1 h-3 w-3 rounded-full ${
              selectedIndex === index ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link to="/menu">
          <Button variant="outline" size="lg">
            SHOW ALL MENU
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default EventPackages;
