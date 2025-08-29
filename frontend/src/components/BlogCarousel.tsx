import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import { Card } from "./ui/card";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useGetAllBlogPosts } from "@/features/Blogs/hooks/useGetAllBlogPosts";
import { BlogPost } from "@/features/Blogs/api/blogs";
import { Link } from "react-router-dom";

const BlogCarousel: React.FC = () => {
  // Fetch all blog posts
  const { data, isPending, isError, error } = useGetAllBlogPosts();

  // Carousel API reference
  const [api, setApi] = useState<CarouselApi>();

  // Responsive group size: 1 on mobile, 2 on tablet, 3 on desktop
  const [groupSize, setGroupSize] = useState<number>(3);

  useEffect(() => {
    const updateGroupSize = () => {
      if (window.innerWidth < 768) {
        setGroupSize(1);
      } else if (window.innerWidth < 1024) {
        setGroupSize(2);
      } else {
        setGroupSize(3);
      }
    };

    updateGroupSize();
    window.addEventListener("resize", updateGroupSize);
    return () => window.removeEventListener("resize", updateGroupSize);
  }, []);

  // Handle loading and error states
  if (isPending) return <div>Loading...</div>;
  if (isError)
    return <div>Error: {error?.message || "An error occurred."}</div>;

  // Prepare posts array (truncate to multiple of 3 on desktop)
  const rawPosts: BlogPost[] = data ?? [];
  const postsToChunk =
    groupSize === 3
      ? rawPosts.slice(0, Math.floor(rawPosts.length / 3) * 3)
      : rawPosts;

  // Chunk posts by groupSize
  const chunkedPosts: BlogPost[][] = [];
  for (let i = 0; i < postsToChunk.length; i += groupSize) {
    chunkedPosts.push(postsToChunk.slice(i, i + groupSize));
  }

  return (
    <section className="mt-20 flex min-h-screen flex-col items-center justify-center p-4 md:p-10">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-base font-semibold text-primary md:text-lg">
          TRIPLE Z COFFEE SHOP
        </h2>
        <p className="font-heading text-3xl md:text-4xl">
          Your Perfect Event Destination
        </p>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 4000 }), Fade()]}
        setApi={setApi}
        className="mt-5 w-full flex-grow"
      >
        <CarouselContent className="-ml-4 h-full">
          {chunkedPosts.map((group, idx) => (
            <CarouselItem key={idx} className="h-full pl-4">
              <div className="flex h-full flex-col gap-4 md:flex-row">
                {group.map((post) => (
                  <Link
                    to={`/blogs/${post._id}`}
                    key={post._id}
                    className={`flex h-full w-full ${
                      groupSize === 3 ? "md:w-1/3" : "md:w-1/2"
                    }`}
                  >
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
