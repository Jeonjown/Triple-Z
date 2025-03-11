import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "./ui/card";
import LoadingPage from "@/pages/LoadingPage";
import ErrorPage from "@/pages/ErrorPage";
import useFetchAllMenuItems from "@/features/Menu/hooks/useFetchAllMenuItems";

const FeaturedProducts = () => {
  const { data, isPending, isError, error } = useFetchAllMenuItems();
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
      {/* FEATURED PRODUCTS */}
      <section className="relative my-10 min-h-screen w-full">
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
    </>
  );
};

export default FeaturedProducts;
