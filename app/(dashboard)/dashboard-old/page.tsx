"use client"; // Mark this as a Client Component

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Define the form input type
type FormInputs = {
  name: string;
  slug?: string; // Optional slug field
};

export default function Dashboard() {
  const [message, setMessage] = useState(""); // State for success/error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  // Handle form submission
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true); // Start loading
    setMessage(""); // Clear previous messages

    try {
      // Send a POST request to the API endpoint
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Parse the response
      const result = await response.json();

      if (response.ok) {
        setMessage("Category created successfully!");
        reset(); // Reset the form
      } else {
        setMessage(result.error || "Failed to create category.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Create a New Category</h1>

      {/* Category Creation Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </Label>
          <Input
            type="text"
            id="name"
            {...register("name", { required: "Category name is required." })}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug (Optional)
          </Label>
          <Input
            type="text"
            id="slug"
            {...register("slug", {
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: "Slug can only contain letters, numbers, and hyphens.",
              },
            })}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.slug ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            If not provided, a slug will be generated automatically.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Creating..." : "Create Category"}
        </Button>

        {/* Display success/error messages */}
        {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
