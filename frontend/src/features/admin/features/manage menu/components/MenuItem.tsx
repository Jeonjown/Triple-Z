import { useParams } from "react-router-dom";
import { useFetchMenuItem } from "../hooks/useFetchMenuItem";
import LoadingPage from "@/pages/LoadingPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

const MenuItem = () => {
  const { menuItemId } = useParams();
  const {
    data: menuItem,
    isPending,
    isError,
    error,
  } = useFetchMenuItem(menuItemId!);

  if (isPending) return <LoadingPage />;
  if (isError) return <p className="text-red-500">Error: {error?.message}</p>;

  return (
    <div className="px-4 py-8 lg:px-16">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList className="mx-6 my-4 text-sm font-semibold md:text-base">
          <BreadcrumbItem>
            <BreadcrumbLink href="/menu">Menu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/menu/categories/${menuItem.category?._id}/subcategories/${menuItem.subcategory?._id}`}
            >
              {menuItem.subcategory?.subcategory}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{menuItem.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Menu Item Card */}
      <div className="mx-auto max-w-4xl rounded-lg bg-secondary p-6 shadow-md">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image Section */}
          <img
            src={menuItem.image}
            alt={menuItem.title}
            className="w-full rounded-lg object-cover shadow-md"
          />

          {/* Content Section */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold md:text-3xl">{menuItem.title}</h2>
            <p className="mt-3 text-gray-700 md:text-lg">
              {menuItem.description}
            </p>

            {/* Price & Sizes */}
            <div className="mt-4">
              {menuItem.basePrice ? (
                <p className="text-lg font-semibold text-primary">
                  ₱{menuItem.basePrice}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {menuItem.sizes?.map((size) => (
                    <Button
                      variant="outline"
                      key={size._id}
                      className="flex flex-col items-center gap-1 border bg-white px-4 py-2"
                    >
                      <span className="text-sm text-gray-600">{size.size}</span>
                      <span className="font-semibold text-primary">
                        ₱{size.sizePrice}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3">
              <button className="rounded-lg border px-3 py-1 hover:bg-gray-200">
                -
              </button>
              <span className="text-lg">1</span>
              <button className="rounded-lg border px-3 py-1 hover:bg-gray-200">
                +
              </button>
            </div>

            {/* Add to Order Button */}
            <Button size="lg" className="mt-4 w-full max-w-xs md:max-w-md">
              Add To Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
