export interface CategoryWithImage {
  id: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  image: string;
  icon: string;
}

export const categoriesWithImages: CategoryWithImage[] = [
  {
    id: 'drip-coffee',
    nameAr: 'القهوة المقطرة',
    nameEn: 'Drip Coffee',
    nameTr: 'Damıtılmış Kahve',
    image: '/manus-storage/category-drip-coffee_c6d35a44.png',
    icon: '☕',
  },
  {
    id: 'cold-coffee',
    nameAr: 'القهوة الباردة',
    nameEn: 'Cold Coffee',
    nameTr: 'Soğuk Kahve',
    image: '/manus-storage/category-cold-coffee_4a19fdad.png',
    icon: '🧊',
  },
  {
    id: 'hot-coffee',
    nameAr: 'القهوة الساخنة',
    nameEn: 'Hot Coffee',
    nameTr: 'Sıcak Kahve',
    image: '/manus-storage/category-hot-coffee_96c4d122.png',
    icon: '☕',
  },
  {
    id: 'hibiscus',
    nameAr: 'كركدية',
    nameEn: 'Hibiscus & Specialty',
    nameTr: 'Hibiskus & Özel',
    image: '/manus-storage/category-hibiscus_6fa02d51.png',
    icon: '🌺',
  },
  {
    id: 'juices',
    nameAr: 'عصيرات',
    nameEn: 'Fresh Juices',
    nameTr: 'Taze Meyveler',
    image: '/manus-storage/category-juices_b1e63625.png',
    icon: '🍊',
  },
  {
    id: 'mojito',
    nameAr: 'موهيتو',
    nameEn: 'Mojito Selection',
    nameTr: 'Mojito Seçkisi',
    image: '/manus-storage/category-mojito_0376499a.png',
    icon: '🍹',
  },
  {
    id: 'tea',
    nameAr: 'شاهي',
    nameEn: 'Tea Collection',
    nameTr: 'Çay Koleksiyonu',
    image: '/manus-storage/category-tea_df039445.png',
    icon: '🫖',
  },
  {
    id: 'dessert',
    nameAr: 'الحلويات',
    nameEn: 'Desserts',
    nameTr: 'Tatlılar',
    image: '/manus-storage/category-dessert_0b5d9ce2.png',
    icon: '🍰',
  },
  {
    id: 'manakish',
    nameAr: 'مناقيش',
    nameEn: 'Manakish & Pizza',
    nameTr: 'Manakış & Pizza',
    image: '/manus-storage/category-manakish_f44d3880.png',
    icon: '🥖',
  },
  {
    id: 'hookah',
    nameAr: 'شيشة',
    nameEn: 'Hookah',
    nameTr: 'Nargile',
    image: '/manus-storage/category-hookah_7095c8ab.png',
    icon: '💨',
  },
];

export function getCategoryName(id: string, language: 'ar' | 'en' | 'tr'): string {
  const category = categoriesWithImages.find((c) => c.id === id);
  if (!category) return '';

  switch (language) {
    case 'ar':
      return category.nameAr;
    case 'en':
      return category.nameEn;
    case 'tr':
      return category.nameTr;
    default:
      return category.nameEn;
  }
}

export function getCategoryImage(id: string): string {
  const category = categoriesWithImages.find((c) => c.id === id);
  return category?.image || '';
}
