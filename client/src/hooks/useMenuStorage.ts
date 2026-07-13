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
  description: string | null;
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
          name: item.name || item.nameAr || '',
          description: item.description || item.descriptionAr || null,
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
        setData(mod.default as MenuData);
        setIsLoaded(true);
      }).catch(() => {
        setIsLoaded(true);
      });
    }
  }, [allData.isError]);

  // Dummy functions for backward compatibility (admin uses tRPC directly now)
  const saveData = (newData: MenuData) => {
    setData(newData);
  };

  const addProduct = (categoryId: string, product: Omit<Product, 'id'>) => {};
  const updateProduct = (categoryId: string, productId: number, updates: Partial<Product>) => {};
  const deleteProduct = (categoryId: string, productId: number) => {};
  const updateCategory = (categoryId: string, updates: Partial<Category>) => {};
  const resetData = () => {
    allData.refetch();
  };

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
