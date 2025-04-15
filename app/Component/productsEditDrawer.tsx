"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm, Controller } from "react-hook-form";
import { Product } from "../lib/generalTypes";
import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input"; // Assuming you have an Input component
// import { Label } from "@/components/ui/label"; // Assuming you have a Label component
// import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component

export function ProductsEdit({ products }: { products: Product }) {
  const { control, handleSubmit, reset } = useForm<Product>({
    defaultValues: products, // Set default values from the `products` prop
  });

  // Handle form submission
  const onSubmit = (data: Product) => {
    console.log("Form data submitted:", data);
    // Add your logic to update the product here (e.g., API call)
  };

  // Reset the form when the sheet is opened
  const onOpenChange = (open: boolean) => {
    if (open) {
      reset(products); // Reset the form with the latest `products` data
    }
  };

  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-max">
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription>
            Make changes to the product details below.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* Name */}
          <div className="w-full flex gap-4 justify-between items-center [&>div]:w-[50%]">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter product name"
                  />
                )}
              />
            </div>
            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="description"
                    placeholder="Enter product description"
                    value={field.value || ""} // Convert null to empty string
                  />
                )}
              />
            </div>
          </div>

          <div className="w-full flex gap-4 justify-between items-center [&>div]:w-[50%]">
            {/* Price */}
            <div>
              <Label htmlFor="price">Price</Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="price"
                    placeholder="Enter product price"
                  />
                )}
              />
            </div>
            {/* Is Offer */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isOffer"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isOffer"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isOffer">Is Offer</Label>
            </div>
          </div>

          {/* Offer Price */}
          <div>
            <Label htmlFor="offerPrice">Offer Price</Label>
            <Controller
              name="offerPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id="offerPrice"
                  placeholder="Enter offer price"
                  value={field.value || 0} // Convert null to 0
                />
              )}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="category"
                  placeholder="Enter product category"
                />
              )}
            />
          </div>

          {/* Is Available */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isAvailable"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isAvailable"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isAvailable">Is Available</Label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
