import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";
import ErrorPage from "@/pages/ErrorPage";
import LoadingPage from "@/pages/LoadingPage";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

const BestSellers = () => {
  const [itemsToShow, setItemsToShow] = useState(6);
  const { data, isPending, isError, error } = useFetchAllMenuItems();

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

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return (
      <ErrorPage message={error?.message} statusCode={error?.statusCode} />
    );
  }

  return (
    <>
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

export default BestSellers;
