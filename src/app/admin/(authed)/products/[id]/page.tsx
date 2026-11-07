import { notFound } from "next/navigation";
import { fetchProducts } from "@/data/products";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await fetchProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl text-ink">{product.ru.name}</h1>
      <div className="mt-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
