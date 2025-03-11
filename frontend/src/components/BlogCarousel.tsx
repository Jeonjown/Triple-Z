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

  // Manage carousel API and slide state
  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrent] = useState<number>(0);
  const [, setCount] = useState<number>(0);
  // Always group 3 posts per slide
  const groupSize = 3;

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

  // Group blog posts into chunks of 3
  const chunkedPosts: BlogPost[][] = [];
  if (data) {
    for (let i = 0; i < data.length; i += groupSize) {
      chunkedPosts.push(data.slice(i, i + groupSize));
    }
  }

  return (
    <div className="my-10 w-full p-4 md:p-10">
      <div className="text-center">
        <h2 className="text-xs font-semibold text-primary md:text-sm">
          TRIPLE Z COFFEE SHOP
        </h2>
        <p className="font-heading text-xl md:text-2xl lg:text-3xl">
          Your Perfect Event Destination
        </p>
      </div>
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 4000 }), Fade()]}
        setApi={setApi}
        className="mt-5 w-full"
      >
        <CarouselContent className="-ml-4">
          {chunkedPosts.map((group, index) => (
            // Each CarouselItem is a slide with 3 posts
            <CarouselItem key={index} className="pl-4">
              <div className="flex flex-row items-stretch gap-4">
                {group.map((post) => (
                  // Each card is wrapped in a Link to its specific blog page
                  <Link
                    to={`/blogs/${post._id}`}
                    key={post._id}
                    className="flex w-1/3"
                  >
                    <Card className="flex h-full flex-col">
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
    </div>
  );
};

export default BlogCarousel;
