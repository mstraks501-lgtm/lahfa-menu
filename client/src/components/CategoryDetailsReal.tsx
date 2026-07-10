import { useRealMenuData } from '@/hooks/useRealMenuData';
import { Card } from '@/components/ui/card';

interface CategoryDetailsRealProps {
  categoryId: string;
  language: 'ar' | 'en';
}

export function CategoryDetailsReal({ categoryId, language }: CategoryDetailsRealProps) {
  const { getCategoryName, getCategoryImage, getCategoryProducts, formatPrice } = useRealMenuData();

  const categoryName = getCategoryName(categoryId, language);
  const categoryImage = getCategoryImage(categoryId);
  const products = getCategoryProducts(categoryId);

  if (!categoryName || products.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-8">
          {categoryImage && (
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
          )}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-card border-border hover:bg-secondary transition-colors duration-200 overflow-hidden group cursor-pointer"
            >
              {/* Product Image */}
              {product.image && (
                <div className="relative h-32 md:h-40 overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <h3 className="text-sm md:text-base font-semibold text-foreground break-words flex-1">
                    {product.name}
                  </h3>
                  <div className="text-accent font-bold text-sm md:text-base whitespace-nowrap">
                    {formatPrice(product.price)}
                    <span className="text-xs text-muted-foreground ml-1">TL</span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
