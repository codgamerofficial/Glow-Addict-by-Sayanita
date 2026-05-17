import React from 'react';
import ProductTable from '@/components/admin/ProductTable';

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <ProductTable />
    </div>
  );
}
import React from 'react';
import ProductsClient from './ProductsClient';
import { getAdminProducts } from '@/actions/admin';

export default async function ProductsPage() {
  const products = await getAdminProducts();
  return <ProductsClient initialProducts={products} />;
}
