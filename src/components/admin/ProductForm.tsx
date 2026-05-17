"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const ProductSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  mrp: z.string().optional(),
  stock: z.number().optional(),
});

type FormData = z.infer<typeof ProductSchema>;

export default function ProductForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(ProductSchema) });

  const onSubmit = async (data: FormData) => {
    console.log('submit', data);
    // TODO: POST to /api/admin/products
    alert('Product saved (stub)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium">Product Name</label>
        <input {...register('title')} className="w-full border rounded p-2" />
        {errors.title && <div className="text-red-500 text-sm">{errors.title.message}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium">Brand</label>
        <input {...register('brand')} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input {...register('category')} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Price</label>
        <input {...register('price')} className="w-full border rounded p-2" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium">Short Description</label>
        <textarea {...register('slug')} className="w-full border rounded p-2" />
      </div>
      <div className="md:col-span-2 flex gap-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
        <button type="button" className="px-4 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}
