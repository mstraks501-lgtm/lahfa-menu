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

export function useRealMenuData() {
  const [data, setData] = useState<MenuData>(realMenuData as MenuData);

  const getCategoryName = (categoryId: string, language: 'ar' | 'en' | 'tr'): string => {
    const category = data.categories.find((c) => c.id === categoryId);
    if (!category) return '';

    switch (language) {
      case 'ar':
        return category.name_ar;
      case 'en':
        return category.name_en;
      case 'tr':
        return category.name_tr;
      default:
        return category.name_en;
    }
  };

  const getCategoryImage = (categoryId: string): string => {
    const category = data.categories.find((c) => c.id === categoryId);
    return category?.image || '';
  };

  const getCategoryProducts = (categoryId: string): Product[] => {
    return data.products[categoryId] || [];
  };

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  return {
    data,
    categories: data.categories,
    getCategoryName,
    getCategoryImage,
    getCategoryProducts,
    formatPrice,
  };
}
