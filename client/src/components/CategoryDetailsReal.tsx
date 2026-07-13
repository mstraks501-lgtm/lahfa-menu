import { useMenuStorage } from '@/hooks/useMenuStorage';
import { Card } from '@/components/ui/card';

interface CategoryDetailsRealProps {
  categoryId: string;
  language: 'ar' | 'en';
}

export function CategoryDetailsReal({ categoryId, language }: CategoryDetailsRealProps) {
  const { data } = useMenuStorage();

  if (!data) {
    return null;
  }

  const category = data.categories.find((c) => c.id === categoryId);
  const products = data.products[categoryId] || [];

  if (!category || products.length === 0) {
    return null;
  }

  const categoryName = language === 'ar' ? category.name_ar : category.name_en;

  const getProductName = (product: any): string => {
    if (language === 'ar') return product.name_ar || product.name || '';
    return product.name_en || product.name || '';
  };

  const getProductDescription = (product: any): string | null => {
    if (language === 'ar') return product.description_ar || product.description || null;
    return product.description_en || product.description || null;
  };

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Category Header */}
        <div className="mb-8">
          {category.image && (
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <img
                src={category.image}
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
          {products.map((product) => {
            const productName = getProductName(product);
            const productDesc = getProductDescription(product);
            return (
              <Card
                key={product.id}
                className="bg-card border-border hover:bg-secondary transition-colors duration-200 overflow-hidden group cursor-pointer"
              >
                {/* Product Image */}
                {product.image && (
                  <div className="relative h-32 md:h-40 overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-sm md:text-base font-semibold text-foreground break-words flex-1">
                      {productName}
                    </h3>
                    <div className="text-accent font-bold text-sm md:text-base whitespace-nowrap">
                      {formatPrice(product.price)}
                      <span className="text-xs text-muted-foreground ml-1">TL</span>
                    </div>
                  </div>

                  {/* Description */}
                  {productDesc && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{productDesc}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
