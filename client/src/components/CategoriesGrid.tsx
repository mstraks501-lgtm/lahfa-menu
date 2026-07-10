import { categoriesWithImages, getCategoryName } from '@/data/categoriesData';
import { Card } from '@/components/ui/card';

interface CategoriesGridProps {
  language: 'ar' | 'en' | 'tr';
  onSelectCategory: (categoryId: string) => void;
}

export function CategoriesGrid({ language, onSelectCategory }: CategoriesGridProps) {
  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoriesWithImages.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
            >
              <Card className="relative h-40 md:h-48 overflow-hidden border-0 bg-card p-0 shadow-lg">
                {/* Image */}
                <img
                  src={category.image}
                  alt={getCategoryName(category.id, language)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4">
                  <div className="text-center">
                    <p className="text-3xl mb-2">{category.icon}</p>
                    <h3 className="text-sm md:text-base font-semibold text-white text-center line-clamp-2">
                      {getCategoryName(category.id, language)}
                    </h3>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
