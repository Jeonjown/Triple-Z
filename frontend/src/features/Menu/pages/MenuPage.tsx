import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useFetchItemsByCategories } from "../hooks/useFetchItemsByCategories";
import LoadingPage from "@/pages/LoadingPage";
import Cart from "../components/Cart";

const MenuPage = () => {
  // TEMP: Replace with actual categoryId and subcategoryId from state or URL
  const { categoryId, subcategoryId } = useParams<{
    categoryId: string;
    subcategoryId: string | undefined;
  }>();
  const { data, isPending, isError, error } = useFetchItemsByCategories(
    categoryId!,
    subcategoryId!,
  );

  const { user } = useAuthStore();

  if (isPending) return <LoadingPage />;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div
      className={`mt-20 pb-20 md:ml-64 md:mt-0 ${user?.role === "admin" ? "xl:ml-80" : ""}`}
    >
      <div className="relative my-8 min-h-screen w-full">
        <h2 className="my-5 text-center font-heading text-4xl font-bold text-primary">
          {data.length > 0 ? data[0].subcategoryName : "Menu"}
        </h2>
        <div className="relative mx-auto grid w-11/12 max-w-5xl grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {data &&
            data.map((menuItem) => (
              <Link
                to={`/menu/${menuItem._id}`}
                key={menuItem._id}
                className="mt-2 w-full"
              >
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
                      <CardTitle className="mt-1 text-center text-xl font-bold text-primary">
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
                        {menuItem.sizes?.map(
                          (
                            size: { size: string; sizePrice: number },
                            index: number,
                          ) => (
                            <div key={index} className="text-center">
                              <span className="block text-xs">{size.size}</span>
                              <span className="text-xs">₱{size.sizePrice}</span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
        </div>
      </div>
      <Cart />
    </div>
  );
};

export default MenuPage;
