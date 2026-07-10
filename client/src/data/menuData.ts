export interface MenuItem {
  name: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

export interface MenuLanguage {
  language: string;
  code: string;
  direction: 'ltr' | 'rtl';
  categories: MenuCategory[];
  cafeInfo: {
    name: string;
    description: string;
    address: string;
    phone: string;
    rating: string;
  };
  nav: {
    menu: string;
    about: string;
    contact: string;
    language: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  contact: {
    title: string;
    phone: string;
    address: string;
    hours: string;
    hoursText: string;
  };
}

export const menuData: Record<string, MenuLanguage> = {
  ar: {
    language: 'العربية',
    code: 'ar',
    direction: 'rtl',
    cafeInfo: {
      name: 'لهفة - مايسون بوتيك كافيه',
      description: 'كافيه بوتيك فاخر بإطلالة خلابة على بحيرة سبانجا، يقدم القهوة العربية الأصيلة والمشروبات المتنوعة والحلويات الفاخرة والمناقيش والشيشة',
      address: 'Kurtköy Dibektaş, Dibektaş Cd. No:68/40, 54600 Sapanca/Sakarya, Türkiye',
      phone: '+90 531 773 45 84',
      rating: '4.6',
    },
    nav: {
      menu: 'المينو',
      about: 'عن الكافيه',
      contact: 'التواصل',
      language: 'اللغة',
    },
    hero: {
      title: 'لهفة - مايسون بوتيك كافيه',
      subtitle: 'تجربة القهوة العربية الأصيلة بإطلالة على بحيرة سبانجا الخلابة',
      cta: 'استكشف المينو',
    },
    contact: {
      title: 'تواصل معنا',
      phone: 'الهاتف',
      address: 'العنوان',
      hours: 'ساعات العمل',
      hoursText: 'يومياً من الصباح حتى المساء',
    },
    categories: [
      {
        id: 'drip-coffee',
        name: 'القهوة المقطرة',
        icon: '☕',
        items: [
          { name: 'V60', price: 20 },
          { name: 'Chemex (كيمكس)', price: 23 },
          { name: 'Ice Coffee Day (قهوة اليوم بارد)', price: 15 },
          { name: 'Ice Drip V60 (ايس دريب V60)', price: 23 },
        ],
      },
      {
        id: 'cold-coffee',
        name: 'القهوة الباردة',
        icon: '🧊',
        items: [
          { name: 'Lahfa Spanish (لهفة سبانش)', price: 12 },
          { name: 'Salted Caramel (سولتد كاراميل)', price: 18 },
          { name: 'Ice Wayt Mocha (ايس وايت موكا)', price: 14 },
          { name: 'Ice Caramel (ايس كاراميل)', price: 14 },
          { name: 'Ice Mocha (ايس موكا)', price: 20 },
          { name: 'Ice Americano (ايس امريكانو)', price: 14 },
          { name: 'Ice Chocolate (شوكلاته باردة)', price: 14 },
        ],
      },
      {
        id: 'hot-coffee',
        name: 'القهوة الساخنة',
        icon: '☕',
        items: [
          { name: 'Espresso (اسبريسو)', price: 12 },
          { name: 'Latte (لاتيه)', price: 18 },
          { name: 'Cappuccino (كابتشينو)', price: 18 },
          { name: 'Flat White (فلات وايت)', price: 14 },
          { name: 'Cortaado (كورتادو)', price: 20 },
          { name: 'Lahfa Spanish (لهفة سبانش)', price: 14 },
          { name: 'Salted Caramel (سولتد كاراميل)', price: 20 },
          { name: 'Mocha (موكا)', price: 20 },
          { name: 'Turkish Coffee (قهوة تركي)', price: 16 },
          { name: 'Americano (امريكانو)', price: 12 },
          { name: 'Hot Chocolate (شوكلاته ساخنة)', price: 20 },
        ],
      },
      {
        id: 'hibiscus',
        name: 'كركدية',
        icon: '🌺',
        items: [
          { name: 'Roselle our eagerness (كركديه لهفتنا)', price: 21 },
          { name: 'Matcha (ماتشا)', price: 21 },
        ],
      },
      {
        id: 'juices',
        name: 'عصيرات',
        icon: '🍊',
        items: [
          { name: 'Lemon Mint (ليمون نعناع)', price: 20 },
          { name: 'Orange (برتقال)', price: 20 },
        ],
      },
      {
        id: 'mojito',
        name: 'موهيتو',
        icon: '🍹',
        items: [
          { name: 'Blue Sky (بلو سكاي)', price: 21 },
          { name: 'Strawberry Mojito (موهيتو ستروبيري)', price: 21 },
          { name: 'Pablo Mojito (بابلو موهيتو)', price: 21 },
          { name: 'Peach Mojito (موهيتو خوخ)', price: 21 },
          { name: 'Mojito Passion Fruit (موهيتو باشن فروت)', price: 21 },
          { name: 'Lahfaof Mojito (لهفة موهيتو)', price: 21 },
          { name: 'Lassay (لاساي)', price: 21 },
          { name: 'Virgin Mojito (موهيتو فيرجن)', price: 21 },
        ],
      },
      {
        id: 'tea',
        name: 'شاهي',
        icon: '🫖',
        items: [
          { name: 'Moroccan Adani tea (ابريق شاهي عدني مغربي)', price: 35 },
          { name: 'Medini tea red mix (ابريق شاهي مديني احمر مكس)', price: 35 },
          { name: 'Hasawi Rose Tea (ابريق شاهي حساوي ورد)', price: 35 },
          { name: 'Cap of Green Tea (شاهي اخضر كوب)', price: 10 },
          { name: 'Cap of Red Tea (شاهي احمر كوب)', price: 10 },
          { name: 'Karak Tea Cap (شاهي كرك كوب)', price: 9 },
          { name: 'Coffee Saudi (قهوة سعودية)', price: 32 },
          { name: 'Cap of Coffee Saudi (كوب قهوة سعودية)', price: 9 },
        ],
      },
      {
        id: 'dessert',
        name: 'الحلويات',
        icon: '🍰',
        items: [
          { name: 'Lahfa Chocolate (لهفة شوكلات)', price: 34 },
          { name: 'Nutella Cake (كيكة نوتيلا)', price: 26 },
          { name: 'San Sebastian (سان سباستيان)', price: 32 },
          { name: 'Tiramisu (تيراميسو)', price: 32 },
          { name: 'Crispy Cheese Mango (كريسبي تشيز مانجو)', price: 28 },
          { name: 'Classic Ice Cream (ايس كريم كلاسيك)', price: 28 },
          { name: 'Raspberry Cheesecake (تشيز كيك توت)', price: 24 },
          { name: 'Red Velvet (ريد فيلفت)', price: 32 },
        ],
      },
      {
        id: 'manakish',
        name: 'مناقيش',
        icon: '🥖',
        items: [
          { name: 'Manaqesh Zaatar (منقوشة زعتر)', price: 20 },
          { name: 'Manaqesh Labneh and Honey (منقوشة لبنه مع عسل)', price: 20 },
          { name: 'Manaqesh Cheese (منقوشة جبنة عكاوي)', price: 20 },
          { name: 'Manaqesh Meat and Cheese (منقوشة لحمة مع جبن)', price: 26 },
          { name: 'Manaqesh Cheese and Hotdog (منقوشة جبنه مع سجق)', price: 26 },
          { name: 'Veg Pizza (بيتزا خضار)', price: 20 },
          { name: 'Manaqesh Hotdog and Cheese (منقوشة نقانق وجبن)', price: 26 },
        ],
      },
      {
        id: 'hookah',
        name: 'شيشة',
        icon: '💨',
        items: [
          { name: 'Two Apples (تفاحتين فاخر)', price: 79 },
          { name: 'Two Apples (تفاحتين نخلة)', price: 79 },
          { name: 'Two Apples (تفاحتين مكس)', price: 79 },
          { name: 'Grapes and Berries (عنب توت فاخر)', price: 79 },
          { name: 'Bubble Gum (علكة مستكة مزايا)', price: 79 },
          { name: 'Lemon and Mint (ليمون نعناع)', price: 79 },
          { name: 'Garpes (بلو بيري)', price: 79 },
          { name: 'Grapes and Mint (عنب نعناع فاخر)', price: 79 },
          { name: 'Watermelon (بطيخ فاخر)', price: 79 },
          { name: 'Strawberry (فراولة فاخر)', price: 79 },
          { name: 'Lahfa Hookah (لهفة شيشة)', price: 79 },
          { name: 'Head Change (تغيير راس)', price: 39 },
        ],
      },
    ],
  },
  en: {
    language: 'English',
    code: 'en',
    direction: 'ltr',
    cafeInfo: {
      name: 'LAHFA Maison Boutique Kafe',
      description: 'A luxurious boutique café overlooking the stunning Sapanca Lake, serving authentic Arabic coffee, diverse beverages, premium pastries, manakish, and hookah',
      address: 'Kurtköy Dibektaş, Dibektaş Cd. No:68/40, 54600 Sapanca/Sakarya, Türkiye',
      phone: '+90 531 773 45 84',
      rating: '4.6',
    },
    nav: {
      menu: 'Menu',
      about: 'About',
      contact: 'Contact',
      language: 'Language',
    },
    hero: {
      title: 'LAHFA Maison Boutique Kafe',
      subtitle: 'Experience authentic Arabic coffee with a breathtaking view of Sapanca Lake',
      cta: 'Explore Menu',
    },
    contact: {
      title: 'Get in Touch',
      phone: 'Phone',
      address: 'Address',
      hours: 'Hours',
      hoursText: 'Daily from morning to evening',
    },
    categories: [
      {
        id: 'drip-coffee',
        name: 'Drip Coffee',
        icon: '☕',
        items: [
          { name: 'V60', price: 20 },
          { name: 'Chemex', price: 23 },
          { name: 'Ice Coffee Day', price: 15 },
          { name: 'Ice Drip V60', price: 23 },
        ],
      },
      {
        id: 'cold-coffee',
        name: 'Cold Coffee',
        icon: '🧊',
        items: [
          { name: 'Lahfa Spanish', price: 12 },
          { name: 'Salted Caramel', price: 18 },
          { name: 'Ice White Mocha', price: 14 },
          { name: 'Ice Caramel', price: 14 },
          { name: 'Ice Mocha', price: 20 },
          { name: 'Ice Americano', price: 14 },
          { name: 'Ice Chocolate', price: 14 },
        ],
      },
      {
        id: 'hot-coffee',
        name: 'Hot Coffee',
        icon: '☕',
        items: [
          { name: 'Espresso', price: 12 },
          { name: 'Latte', price: 18 },
          { name: 'Cappuccino', price: 18 },
          { name: 'Flat White', price: 14 },
          { name: 'Cortado', price: 20 },
          { name: 'Lahfa Spanish', price: 14 },
          { name: 'Salted Caramel', price: 20 },
          { name: 'Mocha', price: 20 },
          { name: 'Turkish Coffee', price: 16 },
          { name: 'Americano', price: 12 },
          { name: 'Hot Chocolate', price: 20 },
        ],
      },
      {
        id: 'hibiscus',
        name: 'Hibiscus & Specialty',
        icon: '🌺',
        items: [
          { name: 'Roselle Our Eagerness', price: 21 },
          { name: 'Matcha', price: 21 },
        ],
      },
      {
        id: 'juices',
        name: 'Fresh Juices',
        icon: '🍊',
        items: [
          { name: 'Lemon Mint', price: 20 },
          { name: 'Orange', price: 20 },
        ],
      },
      {
        id: 'mojito',
        name: 'Mojito Selection',
        icon: '🍹',
        items: [
          { name: 'Blue Sky', price: 21 },
          { name: 'Strawberry Mojito', price: 21 },
          { name: 'Pablo Mojito', price: 21 },
          { name: 'Peach Mojito', price: 21 },
          { name: 'Passion Fruit Mojito', price: 21 },
          { name: 'Lahfa Mojito', price: 21 },
          { name: 'Lassay', price: 21 },
          { name: 'Virgin Mojito', price: 21 },
        ],
      },
      {
        id: 'tea',
        name: 'Tea Collection',
        icon: '🫖',
        items: [
          { name: 'Moroccan Adani Tea (Pot)', price: 35 },
          { name: 'Medini Red Mix Tea (Pot)', price: 35 },
          { name: 'Hasawi Rose Tea (Pot)', price: 35 },
          { name: 'Green Tea (Cup)', price: 10 },
          { name: 'Red Tea (Cup)', price: 10 },
          { name: 'Karak Tea (Cup)', price: 9 },
          { name: 'Saudi Coffee (Pot)', price: 32 },
          { name: 'Saudi Coffee (Cup)', price: 9 },
        ],
      },
      {
        id: 'dessert',
        name: 'Desserts',
        icon: '🍰',
        items: [
          { name: 'Lahfa Chocolate', price: 34 },
          { name: 'Nutella Cake', price: 26 },
          { name: 'San Sebastian', price: 32 },
          { name: 'Tiramisu', price: 32 },
          { name: 'Crispy Cheese Mango', price: 28 },
          { name: 'Classic Ice Cream', price: 28 },
          { name: 'Raspberry Cheesecake', price: 24 },
          { name: 'Red Velvet', price: 32 },
        ],
      },
      {
        id: 'manakish',
        name: 'Manakish & Pizza',
        icon: '🥖',
        items: [
          { name: 'Zaatar Manakish', price: 20 },
          { name: 'Labneh & Honey Manakish', price: 20 },
          { name: 'Cheese Manakish', price: 20 },
          { name: 'Meat & Cheese Manakish', price: 26 },
          { name: 'Cheese & Hotdog Manakish', price: 26 },
          { name: 'Vegetable Pizza', price: 20 },
          { name: 'Hotdog & Cheese Manakish', price: 26 },
        ],
      },
      {
        id: 'hookah',
        name: 'Hookah',
        icon: '💨',
        items: [
          { name: 'Two Apples (Premium)', price: 79 },
          { name: 'Two Apples (Palm)', price: 79 },
          { name: 'Two Apples (Mix)', price: 79 },
          { name: 'Grapes & Berries (Premium)', price: 79 },
          { name: 'Bubble Gum', price: 79 },
          { name: 'Lemon & Mint', price: 79 },
          { name: 'Blueberry', price: 79 },
          { name: 'Grapes & Mint (Premium)', price: 79 },
          { name: 'Watermelon (Premium)', price: 79 },
          { name: 'Strawberry (Premium)', price: 79 },
          { name: 'Lahfa Hookah', price: 79 },
          { name: 'Head Change', price: 39 },
        ],
      },
    ],
  },
  tr: {
    language: 'Türkçe',
    code: 'tr',
    direction: 'ltr',
    cafeInfo: {
      name: 'LAHFA Maison Boutique Kafe',
      description: 'Sapanca Gölü\'nün muhteşem manzarası ile karşı karşıya, otantik Arap kahvesi, çeşitli içecekler, premium pastane, manakış ve nargile sunan lüks bir butik kafe',
      address: 'Kurtköy Dibektaş, Dibektaş Cd. No:68/40, 54600 Sapanca/Sakarya, Türkiye',
      phone: '+90 531 773 45 84',
      rating: '4.6',
    },
    nav: {
      menu: 'Menü',
      about: 'Hakkında',
      contact: 'İletişim',
      language: 'Dil',
    },
    hero: {
      title: 'LAHFA Maison Boutique Kafe',
      subtitle: 'Sapanca Gölü\'nün nefes kesici manzarası ile otantik Arap kahvesi deneyimi',
      cta: 'Menüyü Keşfet',
    },
    contact: {
      title: 'Bize Ulaşın',
      phone: 'Telefon',
      address: 'Adres',
      hours: 'Çalışma Saatleri',
      hoursText: 'Her gün sabahtan akşama kadar',
    },
    categories: [
      {
        id: 'drip-coffee',
        name: 'Damıtılmış Kahve',
        icon: '☕',
        items: [
          { name: 'V60', price: 20 },
          { name: 'Chemex', price: 23 },
          { name: 'Günün Soğuk Kahvesi', price: 15 },
          { name: 'Soğuk Damıtılmış V60', price: 23 },
        ],
      },
      {
        id: 'cold-coffee',
        name: 'Soğuk Kahve',
        icon: '🧊',
        items: [
          { name: 'Lahfa İspanyol', price: 12 },
          { name: 'Tuzlu Karamel', price: 18 },
          { name: 'Soğuk Beyaz Mocha', price: 14 },
          { name: 'Soğuk Karamel', price: 14 },
          { name: 'Soğuk Mocha', price: 20 },
          { name: 'Soğuk Americano', price: 14 },
          { name: 'Soğuk Çikolata', price: 14 },
        ],
      },
      {
        id: 'hot-coffee',
        name: 'Sıcak Kahve',
        icon: '☕',
        items: [
          { name: 'Espresso', price: 12 },
          { name: 'Latte', price: 18 },
          { name: 'Cappuccino', price: 18 },
          { name: 'Flat White', price: 14 },
          { name: 'Cortado', price: 20 },
          { name: 'Lahfa İspanyol', price: 14 },
          { name: 'Tuzlu Karamel', price: 20 },
          { name: 'Mocha', price: 20 },
          { name: 'Türk Kahvesi', price: 16 },
          { name: 'Americano', price: 12 },
          { name: 'Sıcak Çikolata', price: 20 },
        ],
      },
      {
        id: 'hibiscus',
        name: 'Hibiskus & Özel',
        icon: '🌺',
        items: [
          { name: 'Hibiskus Arzumuz', price: 21 },
          { name: 'Matcha', price: 21 },
        ],
      },
      {
        id: 'juices',
        name: 'Taze Meyveler',
        icon: '🍊',
        items: [
          { name: 'Limon Nane', price: 20 },
          { name: 'Portakal', price: 20 },
        ],
      },
      {
        id: 'mojito',
        name: 'Mojito Seçkisi',
        icon: '🍹',
        items: [
          { name: 'Mavi Gökyüzü', price: 21 },
          { name: 'Çilek Mojito', price: 21 },
          { name: 'Pablo Mojito', price: 21 },
          { name: 'Şeftali Mojito', price: 21 },
          { name: 'Tutku Meyvesi Mojito', price: 21 },
          { name: 'Lahfa Mojito', price: 21 },
          { name: 'Lassay', price: 21 },
          { name: 'Virgin Mojito', price: 21 },
        ],
      },
      {
        id: 'tea',
        name: 'Çay Koleksiyonu',
        icon: '🫖',
        items: [
          { name: 'Fas Adeni Çayı (Pot)', price: 35 },
          { name: 'Medini Kırmızı Karışım Çayı (Pot)', price: 35 },
          { name: 'Hasavi Gül Çayı (Pot)', price: 35 },
          { name: 'Yeşil Çay (Fincan)', price: 10 },
          { name: 'Kırmızı Çay (Fincan)', price: 10 },
          { name: 'Karak Çayı (Fincan)', price: 9 },
          { name: 'Suudi Kahvesi (Pot)', price: 32 },
          { name: 'Suudi Kahvesi (Fincan)', price: 9 },
        ],
      },
      {
        id: 'dessert',
        name: 'Tatlılar',
        icon: '🍰',
        items: [
          { name: 'Lahfa Çikolata', price: 34 },
          { name: 'Nutella Pastası', price: 26 },
          { name: 'San Sebastian', price: 32 },
          { name: 'Tiramisu', price: 32 },
          { name: 'Çıtır Peynir Mango', price: 28 },
          { name: 'Klasik Dondurma', price: 28 },
          { name: 'Frambuaz Cheesecake', price: 24 },
          { name: 'Red Velvet', price: 32 },
        ],
      },
      {
        id: 'manakish',
        name: 'Manakış & Pizza',
        icon: '🥖',
        items: [
          { name: 'Zaatar Manakışı', price: 20 },
          { name: 'Labne & Bal Manakışı', price: 20 },
          { name: 'Peynir Manakışı', price: 20 },
          { name: 'Kıyma & Peynir Manakışı', price: 26 },
          { name: 'Peynir & Sosisli Manakışı', price: 26 },
          { name: 'Sebze Pizzası', price: 20 },
          { name: 'Sosisli & Peynir Manakışı', price: 26 },
        ],
      },
      {
        id: 'hookah',
        name: 'Nargile',
        icon: '💨',
        items: [
          { name: 'İki Elma (Premium)', price: 79 },
          { name: 'İki Elma (Palmiye)', price: 79 },
          { name: 'İki Elma (Karışık)', price: 79 },
          { name: 'Üzüm & Meyveler (Premium)', price: 79 },
          { name: 'Sakız', price: 79 },
          { name: 'Limon & Nane', price: 79 },
          { name: 'Mavi Böğürtlen', price: 79 },
          { name: 'Üzüm & Nane (Premium)', price: 79 },
          { name: 'Karpuz (Premium)', price: 79 },
          { name: 'Çilek (Premium)', price: 79 },
          { name: 'Lahfa Nargile', price: 79 },
          { name: 'Baş Değişimi', price: 39 },
        ],
      },
    ],
  },
};
