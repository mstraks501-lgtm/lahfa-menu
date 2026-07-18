import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

export interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_ar: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  name_tr: string;
  name_ar: string;
  name_en: string;
  description: string | null;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  image: string | null;
}

export interface MenuData {
  categories: Category[];
  products: Record<string, Product[]>;
}

export function useMenuStorage() {
  const [data, setData] = useState<MenuData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch data from server API
  const allData = trpc.menu.getAllData.useQuery(undefined, {
    refetchOnWindowFocus: true,
    staleTime: 10000, // 10 seconds
  });

  useEffect(() => {
    if (allData.data) {
      // Transform server data format to frontend format
      const serverData = allData.data as any;
      
      // Transform categories: server uses {name, nameAr, nameEn} -> frontend uses {name_tr, name_ar, name_en}
      const categories: Category[] = (serverData.categories || []).map((cat: any) => ({
        id: cat.id,
        name_tr: cat.name || '',
        name_en: cat.nameEn || cat.name || '',
        name_ar: cat.nameAr || cat.name || '',
        image: cat.image || '',
      }));

      // Transform items: server uses flat array -> frontend uses dict keyed by categoryId
      const products: Record<string, Product[]> = {};
      (serverData.items || []).forEach((item: any) => {
        const categoryId = item.categoryId;
        if (!products[categoryId]) {
          products[categoryId] = [];
        }
        products[categoryId].push({
          id: item.id,
          name: item.name || '',
          name_tr: item.name || '',
          name_ar: item.nameAr || item.name || '',
          name_en: item.nameEn || item.name || '',
          description: item.description || null,
          description_ar: item.descriptionAr || item.description || null,
          description_en: item.descriptionEn || item.description || null,
          price: item.price || 0,
          image: item.image || null,
        });
      });

      setData({ categories, products });
      setIsLoaded(true);
    }
  }, [allData.data]);

  // Handle loading state
  useEffect(() => {
    if (allData.isError) {
      // Fallback: try to load from static import if API fails
      import('@/data/realMenuData.json').then((mod) => {
        const raw = mod.default as any;
        // Transform old format to new format
        const categories = raw.categories.map((cat: any) => ({
          ...cat,
          name_tr: cat.name_tr || '',
          name_ar: cat.name_ar || '',
          name_en: cat.name_en || '',
        }));
        const products: Record<string, Product[]> = {};
        for (const [catId, prods] of Object.entries(raw.products)) {
          products[catId] = (prods as any[]).map(p => ({
            ...p,
            name_tr: p.name || '',
            name_ar: p.name || '',
            name_en: p.name || '',
            description_ar: p.description || null,
            description_en: p.description || null,
          }));
        }
        setData({ categories, products });
        setIsLoaded(true);
      }).catch(() => {
        setIsLoaded(true);
      });
    }
  }, [allData.isError]);

  // Dummy functions for backward compatibility
  type ProductDraft = Pick<Product, 'name' | 'description' | 'price' | 'image'>;
  const saveData = (newData: MenuData) => { setData(newData); };
  const addProduct = (_categoryId: string, _product: ProductDraft) => {};
  const updateProduct = (_categoryId: string, _productId: number, _product: ProductDraft) => {};
  const deleteProduct = (_categoryId: string, _productId: number) => {};
  const updateCategory = () => {};
  const resetData = () => { allData.refetch(); };

  return {
    data,
    isLoaded,
    saveData,
    addProduct,
    updateProduct,
    deleteProduct,
    updateCategory,
    resetData,
  };
}
