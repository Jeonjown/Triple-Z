import { useEffect } from "react";
import { useFetchMenu } from "@/features/admin/features/manage menu/hooks/useFetchMenu";
import { useNavigate, useParams } from "react-router-dom";
import MenuSidebar from "@/components/MenuSidebar";
import MenuPage from "@/components/MenuPage";

const Menu = () => {
  const { data } = useFetchMenu();
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams<{
    categoryId?: string;
    subcategoryId?: string;
  }>();

  useEffect(() => {
    if (!categoryId && !subcategoryId && data?.categories?.length > 0) {
      const firstCategory = data.categories[0];
      const firstSubcategory = firstCategory.subcategories[0];

      if (firstCategory && firstSubcategory) {
        navigate(`/menu/${firstCategory._id}/${firstSubcategory._id}`);
      }
    }
  }, [data, categoryId, subcategoryId, navigate]);

  return (
    <>
      <div className="">
        <MenuSidebar />
        <MenuPage />
      </div>
    </>
  );
};

export default Menu;
