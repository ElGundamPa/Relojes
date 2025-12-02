// Cliente para el servicio de marcas (usa API routes)
import { BrandData } from "@/data/brands";

export const brandsServiceClient = {
  getAll: async (): Promise<BrandData[]> => {
    const response = await fetch("/api/admin/brands");
    const data = await response.json();
    return data.brands || [];
  },

  getBySlug: async (slug: string): Promise<BrandData | undefined> => {
    const brands = await this.getAll();
    return brands.find((b: BrandData) => b.slug === slug);
  },

  create: async (
    brandData: Omit<BrandData, "slug" | "count" | "image">
  ): Promise<BrandData> => {
    const response = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brandData),
    });
    const data = await response.json();
    return data.brand;
  },

  update: async (
    slug: string,
    updates: Partial<BrandData>
  ): Promise<BrandData | null> => {
    const response = await fetch("/api/admin/brands", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...updates }),
    });
    if (response.status === 404) return null;
    const data = await response.json();
    return data.brand;
  },

  delete: async (slug: string): Promise<boolean> => {
    const response = await fetch(`/api/admin/brands?slug=${slug}`, {
      method: "DELETE",
    });
    return response.ok;
  },
};

