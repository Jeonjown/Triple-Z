import { useEffect } from "react";
import { useFetchMenu } from "@/features/admin/features/manage menu/hooks/useFetchMenu";
import { useNavigate, useParams } from "react-router-dom";
import MenuPage from "@/features/admin/features/manage menu/pages/MenuPage";
import MenuSidebar from "../components/MenuSidebar";
import Cart from "../components/Cart";

const Menu = () => {
  const { data } = useFetchMenu();
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams<{
    categoryId?: string;
    subcategoryId?: string;
  }>();

  useEffect(() => {
    if (!categoryId && !subcategoryId && data?.categories?.length) {
      const firstCategory = data.categories[0];

      if (firstCategory?.subcategories?.length) {
        const firstSubcategory = firstCategory.subcategories[0];
        navigate(
          `/menu/categories/${firstCategory._id}/subcategories/${firstSubcategory._id}`,
        );
      }
    }
  }, [data, categoryId, subcategoryId, navigate]);

  return (
    <>
      <div className="">
        <MenuSidebar />
        <MenuPage />
        <Cart />
      </div>
    </>
  );
};

export default Menu;
