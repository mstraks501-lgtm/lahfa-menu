import { useState, useEffect } from 'react';
import realMenuData from '@/data/realMenuData.json';

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

const STORAGE_KEY = 'lahfa_menu_data';

export function useMenuStorage() {
  const [data, setData] = useState<MenuData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل البيانات من localStorage أو البيانات الافتراضية
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(realMenuData as MenuData);
      }
    } else {
      setData(realMenuData as MenuData);
    }
    setIsLoaded(true);
  }, []);

  // حفظ البيانات في localStorage
  const saveData = (newData: MenuData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  // إضافة منتج جديد
  const addProduct = (categoryId: string, product: Omit<Product, 'id'>) => {
    if (!data) return;

    const newData = { ...data };
    const categoryProducts = newData.products[categoryId] || [];
    const newId = Math.max(...categoryProducts.map((p) => p.id), 0) + 1;

    newData.products[categoryId] = [
      ...categoryProducts,
      { ...product, id: newId },
    ];

    saveData(newData);
  };

  // تعديل منتج
  const updateProduct = (
    categoryId: string,
    productId: number,
    updates: Partial<Product>
  ) => {
    if (!data) return;

    const newData = { ...data };
    const categoryProducts = newData.products[categoryId] || [];

    newData.products[categoryId] = categoryProducts.map((p) =>
      p.id === productId ? { ...p, ...updates } : p
    );

    saveData(newData);
  };

  // حذف منتج
  const deleteProduct = (categoryId: string, productId: number) => {
    if (!data) return;

    const newData = { ...data };
    newData.products[categoryId] = (newData.products[categoryId] || []).filter(
      (p) => p.id !== productId
    );

    saveData(newData);
  };

  // تعديل فئة
  const updateCategory = (categoryId: string, updates: Partial<Category>) => {
    if (!data) return;

    const newData = { ...data };
    const categoryIndex = newData.categories.findIndex((c) => c.id === categoryId);

    if (categoryIndex !== -1) {
      newData.categories[categoryIndex] = {
        ...newData.categories[categoryIndex],
        ...updates,
      };
      saveData(newData);
    }
  };

  // إعادة تعيين البيانات للقيم الافتراضية
  const resetData = () => {
    setData(realMenuData as MenuData);
    localStorage.removeItem(STORAGE_KEY);
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
