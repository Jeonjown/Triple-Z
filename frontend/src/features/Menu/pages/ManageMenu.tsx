// ManageMenu.tsx
import React from "react";
import MenuControlPanel from "@/app/tables/menu/MenuControlPanel";

const ManageMenu: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full">
        <MenuControlPanel />
      </div>
    </div>
  );
};

export default ManageMenu;
