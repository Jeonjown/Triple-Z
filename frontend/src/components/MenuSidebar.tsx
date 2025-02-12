import { useState } from "react";
import { useFetchMenu } from "@/features/admin/features/manage menu/hooks/useFetchMenu";
import { Link } from "react-router-dom";

const MenuSidebar = () => {
  const { data } = useFetchMenu();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {/* Dropdown Button for Small Screens */}
      <div className="fixed left-0 top-24 z-10 w-full bg-white p-3 shadow-md sm:hidden">
        <button
          className="w-full rounded-md bg-primary p-2 text-white"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {isDropdownOpen ? "Close Menu" : "Select Category"}
        </button>

        {isDropdownOpen && (
          <div className="mt-2 animate-fadeIn rounded-md border bg-white p-3 shadow-lg transition-opacity duration-300 ease-in-out">
            {data?.categories.map((category) => (
              <div key={category._id} className="mb-3">
                <h2 className="font-bold text-primary">{category.category}</h2>
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory._id}
                    to={`/menu/${category._id}/${subcategory._id}`}
                    className="block p-1 hover:font-bold"
                    onClick={() => setIsDropdownOpen(false)} // Close dropdown on selection
                  >
                    {subcategory.subcategory}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar for Medium Screens and Up */}
      <div className="border-gray-0 fixed top-24 mt-2 hidden min-h-screen w-64 rounded-lg border bg-white md:block">
        <aside className="flex flex-col font-semibold text-primary">
          {data?.categories.map((category) => (
            <ul key={category._id} className="p-7">
              <div className="my-2 font-heading text-4xl font-bold">
                {category.category}
              </div>
              {category.subcategories.map((subcategory) => (
                <ul key={subcategory._id} className="mt-1 hover:font-bold">
                  <Link to={`/menu/${category._id}/${subcategory._id}`}>
                    <li className="">{subcategory.subcategory}</li>
                  </Link>
                </ul>
              ))}
            </ul>
          ))}
        </aside>
      </div>
    </>
  );
};

export default MenuSidebar;
