import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/features/Auth/stores/useAuthStore";
import { useFetchItemsByCategories } from "../hooks/useFetchItemsByCategories";
import LoadingPage from "@/pages/LoadingPage";
import Cart from "../components/Cart";

const MenuPage = () => {
  // Get the categoryId and subcategoryId from the URL
  const { categoryId, subcategoryId } = useParams<{
    categoryId: string;
    subcategoryId: string | undefined;
  }>();

  // Fetch data based on categories, default to an empty array if undefined.
  const { data = [], isPending } = useFetchItemsByCategories(
    categoryId!,
    subcategoryId!,
  );

  const { user } = useAuthStore();

  // Show loading screen while data is being fetched
  if (isPending) return <LoadingPage />;

  // Display centered empty message if data is empty
  if (data.length === 0) {
    return (
      <div
        className={`mt-20 pb-20 md:ml-40 md:mt-0 ${
          user?.role === "admin" ? "xl:ml-64" : ""
        } flex h-screen items-center justify-center`}
      >
        <p className="text-xl font-bold text-primary">No items available.</p>
      </div>
    );
  }

  return (
    <div
      className={`mt-20 pb-20 md:ml-64 md:mt-0 ${
        user?.role === "admin" ? "xl:ml-80" : ""
      }`}
    >
      <div className="relative my-8 min-h-screen w-full">
        <h2 className="my-5 text-center font-heading text-4xl font-bold text-primary">
          {data.length > 0 ? data[0].subcategoryName : "Menu"}
        </h2>
        <div className="relative mx-auto grid w-11/12 max-w-5xl grid-cols-1 gap-4 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {data.map((menuItem) => {
            const cardContent = (
              <Card
                className={`relative mx-auto h-full w-full max-w-lg border-none shadow-none ${
                  menuItem.availability === false ? "opacity-50" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={menuItem.image || "default-image.png"}
                    alt={menuItem.title}
                    className="mx-auto h-auto w-auto"
                  />
                  {menuItem.availability === false && (
                    <Badge
                      variant="destructive"
                      className="absolute right-2 top-2 px-3"
                    >
                      Not Available
                    </Badge>
                  )}
                </div>
                <div>
                  <CardHeader className="p-0">
                    <CardTitle className="mt-1 text-center text-xl font-bold text-primary">
                      {menuItem.title}
                    </CardTitle>
                  </CardHeader>
                </div>
                <div className="mt-2 text-center">
                  {menuItem.basePrice ? (
                    <div className="mx-auto text-xs">₱{menuItem.basePrice}</div>
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
            );

            // If item is available, wrap with Link; otherwise, render as a disabled div.
            return menuItem.availability !== false ? (
              <Link
                to={`/menu/${menuItem._id}`}
                key={menuItem._id}
                className="mt-2 w-full"
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={menuItem._id}
                className="pointer-events-none mt-2 w-full cursor-not-allowed"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
      <Cart />
    </div>
  );
};

export default MenuPage;
