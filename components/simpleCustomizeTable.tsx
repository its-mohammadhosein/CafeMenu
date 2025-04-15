"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { schema } from "./data-table";
import * as React from "react";
// import { z } from "@/node_modules/zod/lib/external";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Button } from "./ui/button";
import { Edit, EditIcon, GripVerticalIcon } from "lucide-react";
import { ProductsEdit } from "@/app/Component/productsEditDrawer";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  isOffer: boolean;
  offerPrice: number | null;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  stock: number | null;
  tags: string[];
}
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

export default function SimpleCustomizeTable() {
  // Sample data
  const sampleData: Product[] = [
    {
      id: 1,
      name: "Espresso",
      description: "A strong, bold coffee made with finely ground beans.",
      price: 2.99,
      isOffer: false,
      offerPrice: null,
      category: "Coffee",
      isAvailable: true,
      createdAt: new Date("2025-01-10T08:00:00Z"),
      updatedAt: new Date("2025-03-10T09:00:00Z"),
      imageUrl: "https://example.com/images/espresso.jpg",
      stock: null,
      tags: ["coffee", "espresso", "hot"],
    },
    {
      id: 2,
      name: "Cappuccino",
      description: "A perfect blend of espresso, steamed milk, and foam.",
      price: 4.5,
      isOffer: true,
      offerPrice: 3.8,
      category: "Coffee",
      isAvailable: true,
      createdAt: new Date("2025-02-01T09:00:00Z"),
      updatedAt: new Date("2025-03-12T10:30:00Z"),
      imageUrl: "https://example.com/images/cappuccino.jpg",
      stock: 50,
      tags: ["coffee", "cappuccino", "milk", "hot"],
    },
    {
      id: 3,
      name: "Latte",
      description: "A creamy espresso-based drink with steamed milk.",
      price: 4.99,
      isOffer: false,
      offerPrice: null,
      category: "Coffee",
      isAvailable: true,
      createdAt: new Date("2025-01-20T07:30:00Z"),
      updatedAt: new Date("2025-03-15T11:00:00Z"),
      imageUrl: "https://example.com/images/latte.jpg",
      stock: 30,
      tags: ["coffee", "latte", "milk", "hot"],
    },
    {
      id: 4,
      name: "Matcha Latte",
      description: "A smooth blend of matcha green tea and steamed milk.",
      price: 5.5,
      isOffer: true,
      offerPrice: 4.75,
      category: "Tea",
      isAvailable: true,
      createdAt: new Date("2025-02-15T10:00:00Z"),
      updatedAt: new Date("2025-03-18T09:45:00Z"),
      imageUrl: "https://example.com/images/matcha-latte.jpg",
      stock: 25,
      tags: ["tea", "matcha", "latte", "hot"],
    },
    {
      id: 5,
      name: "Iced Americano",
      description: "A refreshing blend of espresso and cold water over ice.",
      price: 3.5,
      isOffer: false,
      offerPrice: null,
      category: "Coffee",
      isAvailable: true,
      createdAt: new Date("2025-03-01T08:15:00Z"),
      updatedAt: new Date("2025-03-20T12:00:00Z"),
      imageUrl: "https://example.com/images/iced-americano.jpg",
      stock: 40,
      tags: ["coffee", "iced", "americano", "cold"],
    },
    {
      id: 6,
      name: "Chai Tea",
      description: "A spiced tea blend with cinnamon, cardamom, and ginger.",
      price: 4.25,
      isOffer: true,
      offerPrice: 3.75,
      category: "Tea",
      isAvailable: true,
      createdAt: new Date("2025-02-28T09:00:00Z"),
      updatedAt: new Date("2025-03-22T11:30:00Z"),
      imageUrl: "https://example.com/images/chai-tea.jpg",
      stock: 20,
      tags: ["tea", "chai", "spiced", "hot"],
    },
    {
      id: 7,
      name: "Mocha",
      description:
        "A delicious blend of espresso, chocolate, and steamed milk.",
      price: 5.0,
      isOffer: false,
      offerPrice: null,
      category: "Coffee",
      isAvailable: true,
      createdAt: new Date("2025-03-05T07:45:00Z"),
      updatedAt: new Date("2025-03-25T10:15:00Z"),
      imageUrl: "https://example.com/images/mocha.jpg",
      stock: 35,
      tags: ["coffee", "mocha", "chocolate", "hot"],
    },
    {
      id: 8,
      name: "Strawberry Smoothie",
      description: "A refreshing blend of strawberries, yogurt, and honey.",
      price: 6.0,
      isOffer: false,
      offerPrice: null,
      category: "Smoothie",
      isAvailable: true,
      createdAt: new Date("2025-03-10T10:00:00Z"),
      updatedAt: new Date("2025-03-27T12:00:00Z"),
      imageUrl: "https://example.com/images/strawberry-smoothie.jpg",
      stock: 15,
      tags: ["smoothie", "strawberry", "cold", "fruit"],
    },
    {
      id: 9,
      name: "Hot Chocolate",
      description: "A rich and creamy hot chocolate topped with whipped cream.",
      price: 4.75,
      isOffer: true,
      offerPrice: 4.25,
      category: "Beverage",
      isAvailable: true,
      createdAt: new Date("2025-03-12T09:30:00Z"),
      updatedAt: new Date("2025-03-28T11:45:00Z"),
      imageUrl: "https://example.com/images/hot-chocolate.jpg",
      stock: 18,
      tags: ["hot chocolate", "beverage", "cocoa", "hot"],
    },
  ];

  const [data, setData] = React.useState<Product[]>([]);
  // Define columns
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = (await response.json()) as Product[];
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Fallback to empty array in case of error
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  const columns: ColumnDef<Product>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
      // size: 50,
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "category",
      header: "Category Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (info) => `$${info.getValue()}`,
    },
    {
      accessorKey: "id",
      header: "EDIT",
      cell: ({ row }) => {
        return (
          <ProductsEdit products={row.original}/>
          // <Button
          //   variant="outline"
          //   className="w-max  "
          //   onClick={() => {
          //     console.log("Edit", row.original.id);
          //     // Handle edit action here
          //   }}
          // >
          //   <EditIcon className=" h-4 w-4" />
          // </Button>
        );
      },
      size:50
    },
  ];

  // State variables
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Extract row IDs for sortable context
  // const dataIds = data.map((item) => item.id.toString());

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: false,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  function handleDragEnd(event: DragEndEvent) {
    console.log(event);

    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = data.findIndex((item) => item.id === active.id);
        const newIndex = data.findIndex((item) => item.id === over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const sortableId = React.useId();
  // const dataIds = React.useMemo<UniqueIdentifier[]>(
  //   () => data?.map(({ id }) => id) || [],
  //   [data]
  // );

  return (
    <div className="mx-6 rounded-lg -hidden border">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table className="">
          <TableHeader className="sticky top-0 z-10 bg-muted ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <SortableContext
                items={data.map((item) => item.id)} // Use `data` directly here
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <CustomDraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}

function CustomDraggableRow({ row }: { row: Row<Product> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative w-max z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell className={`w-[${cell.column.getSize()}px]`} key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
