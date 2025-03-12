import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import { Card } from "./ui/card";
import Autoplay from "embla-carousel-autoplay";
import { useGetAllBlogPosts } from "@/features/Blogs/hooks/useGetAllBlogPosts";
import { BlogPost } from "@/features/Blogs/api/blogs";
import { Link } from "react-router-dom";
import Fade from "embla-carousel-fade";

const BlogCarousel: React.FC = () => {
  // Fetch blog posts using your hook
  const { data, isPending, isError, error } = useGetAllBlogPosts();

  // Manage carousel API and slide state with explicit types
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [, setCurrent] = useState<number>(0);
  const [, setCount] = useState<number>(0);

  // State to control number of photos per slide (groupSize)
  const [groupSize, setGroupSize] = useState<number>(3);

  // Update groupSize based on window width
  useEffect(() => {
    const updateGroupSize = () => {
      if (window.innerWidth < 768) {
        // Mobile: show 1 photo per slide
        setGroupSize(1);
      } else if (window.innerWidth < 1024) {
        // Tablet: show 2 photos per slide
        setGroupSize(2);
      } else {
        // Desktop: show 3 photos per slide
        setGroupSize(3);
      }
    };

    updateGroupSize(); // Initial check
    window.addEventListener("resize", updateGroupSize);
    return () => window.removeEventListener("resize", updateGroupSize);
  }, []);

  // Update carousel slide count and current slide index when API is available
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  // Show loading or error states
  if (isPending) return <div>Loading...</div>;
  if (isError)
    return <div>Error: {error?.message || "An error occurred."}</div>;

  // Group blog posts into chunks based on groupSize
  const chunkedPosts: BlogPost[][] = [];
  if (data) {
    for (let i = 0; i < data.length; i += groupSize) {
      chunkedPosts.push(data.slice(i, i + groupSize));
    }
  }

  return (
    <section className="mt-20 flex min-h-screen flex-col items-center justify-center p-4 md:p-10">
      {/* Responsive heading and subheading */}
      <div className="text-center">
        <h2 className="text-base font-semibold text-primary md:text-lg">
          TRIPLE Z COFFEE SHOP
        </h2>
        <p className="font-heading text-3xl md:text-4xl">
          Your Perfect Event Destination
        </p>
      </div>
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 4000 }), Fade()]}
        setApi={setApi}
        className="mt-5 w-full flex-grow"
      >
        <CarouselContent className="-ml-4 h-full">
          {chunkedPosts.map((group, index) => (
            <CarouselItem key={index} className="h-full pl-4">
              <div className="flex h-full flex-col items-stretch gap-4 md:flex-row">
                {group.map((post) => (
                  <Link
                    to={`/blogs/${post._id}`}
                    key={post._id}
                    // Use conditional width: on tablet, use 50% width if groupSize is 2; else 33.33% for 3
                    className={`flex h-full w-full ${
                      groupSize === 3 ? "md:w-1/3" : "md:w-1/2"
                    }`}
                  >
                    {/* Card height scales relative to viewport */}
                    <Card className="flex h-[65vh] w-full flex-col">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </Card>
                  </Link>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default BlogCarousel;
