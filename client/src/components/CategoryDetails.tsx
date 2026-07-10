import { MenuLanguage, MenuItem } from '@/data/menuData';
import { getCategoryName, getCategoryImage } from '@/data/categoriesData';
import { Card } from '@/components/ui/card';

interface CategoryDetailsProps {
  categoryId: string;
  language: 'ar' | 'en' | 'tr';
  data: MenuLanguage;
}

export function CategoryDetails({ categoryId, language, data }: CategoryDetailsProps) {
  const category = data.categories.find((c) => c.id === categoryId);

  if (!category) {
    return null;
  }

  const categoryImage = getCategoryImage(categoryId);
  const categoryName = getCategoryName(categoryId, language);

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-8">
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <img
              src={categoryImage}
              alt={categoryName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-0 flex items-end p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{categoryName}</h1>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.items.map((item, index) => (
            <Card
              key={index}
              className="bg-card border-border p-4 hover:bg-secondary transition-colors duration-200"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-semibold text-foreground break-words">
                    {item.name}
                  </h3>
                </div>
                <div className="text-accent font-bold text-sm md:text-base whitespace-nowrap">
                  {item.price}
                  <span className="text-xs text-muted-foreground mr-1">ر.س</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
