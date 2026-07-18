import { useMenuStorage } from '@/hooks/useMenuStorage';
import { Card } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

interface CategoriesGridRealProps {
  language: 'ar' | 'en' | 'tr';
  onSelectCategory: (categoryId: string) => void;
}

export function CategoriesGridReal({ language, onSelectCategory }: CategoriesGridRealProps) {
  const { data } = useMenuStorage();

  if (!data) {
    return null;
  }

  const getCategoryName = (categoryId: string): string => {
    const category = data.categories.find((c) => c.id === categoryId);
    if (!category) return '';

    if (language === 'tr') return category.name_tr || '';
    if (language === 'ar') return category.name_ar || category.name_tr || '';
    return category.name_en || category.name_tr || '';
  };

  // Show ALL categories (not just ones with images)
  const allCategories = data.categories;

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              <Card className="relative h-40 md:h-48 overflow-hidden border-0 bg-card p-0 shadow-lg">
                {/* Image or Placeholder */}
                {category.image ? (
                  <img
                    src={category.image}
                    alt={getCategoryName(category.id)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-secondary to-card">
                    <UtensilsCrossed className="h-12 w-12 text-muted-foreground/50 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                  <h3 className="text-sm md:text-base font-semibold text-white text-center line-clamp-2">
                    {getCategoryName(category.id)}
                  </h3>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
