// columns.ts
import { createColumnHelper } from "@tanstack/react-table";

export interface MenuItem {
  _id?: string;
  title: string;
  image: string;
  basePrice: number | null;
  sizes: { _id: string; size: string; sizePrice: number }[];
  requiresSizeSelection: boolean;
  description: string;
  availability?: boolean;
  createdAt: string;
  categoryId?: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
}

const columnHelper = createColumnHelper<MenuItem>();

export const columns = [
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => info.getValue(),
    enableHiding: true,
  }),
  columnHelper.accessor("_id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("image", {
    header: "Image",
    cell: (info) => (
      <img
        src={info.getValue()}
        alt={info.getValue()}
        className="h-16 w-16 rounded object-cover"
      />
    ),
  }),
  columnHelper.accessor("title", {
    header: "Item",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("basePrice", {
    header: "Base Price",
    cell: (info) => {
      const basePrice = info.getValue();
      return basePrice != null ? `₱${basePrice.toFixed(2)}` : "None";
    },
  }),
  columnHelper.accessor("sizes", {
    header: "Sizes",
    cell: (info) => {
      const sizes = info.getValue();
      if (!sizes || sizes.length === 0) {
        return "None";
      }
      return sizes.map((size) => (
        <div key={size._id}>
          {size.size}: ₱
          {size.sizePrice != null ? size.sizePrice.toFixed(2) : "None"}
        </div>
      ));
    },
  }),
  columnHelper.accessor("categoryName", {
    header: "Category",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("subcategoryName", {
    header: "Subcategory",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("availability", {
    header: "Availability",
    cell: (info) => (info.getValue() ? "Available" : "Out of Stock"),
  }),
];
