import React from 'react';
import ProductsClient from './ProductsClient';
import { getAdminProducts } from '@/actions/admin';

export default async function ProductsPage() {
  const products = await getAdminProducts();
  return <ProductsClient initialProducts={products} />;
}
