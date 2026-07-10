import { MenuLanguage } from '@/data/menuData';
import { Card } from '@/components/ui/card';
import { Coffee, Leaf, Users } from 'lucide-react';

interface AboutSectionProps {
  data: MenuLanguage;
}

export function AboutSection({ data }: AboutSectionProps) {
  const features = [
    {
      icon: Coffee,
      title: data.language === 'ar' ? 'القهوة العربية الأصيلة' : data.language === 'en' ? 'Authentic Arabic Coffee' : 'Otantik Arap Kahvesi',
      description: data.language === 'ar' ? 'تحضر بعناية فائقة باستخدام أفضل أنواع البن المختارة' : data.language === 'en' ? 'Carefully prepared using the finest selected coffee beans' : 'En iyi seçilmiş kahve çekirdekleri kullanılarak hazırlanır',
    },
    {
      icon: Leaf,
      title: data.language === 'ar' ? 'إطلالة بحيرة سبانجا' : data.language === 'en' ? 'Sapanca Lake View' : 'Sapanca Gölü Manzarası',
      description: data.language === 'ar' ? 'استمتع بالهدوء والطبيعة الخلابة أثناء تناول قهوتك' : data.language === 'en' ? 'Enjoy peace and beautiful nature while having your coffee' : 'Kahvenizi içerken huzur ve güzel doğayı tadın',
    },
    {
      icon: Users,
      title: data.language === 'ar' ? 'تجربة فريدة' : data.language === 'en' ? 'Unique Experience' : 'Benzersiz Deneyim',
      description: data.language === 'ar' ? 'كافيه بوتيك يجمع بين الفخامة والراحة والضيافة الحارة' : data.language === 'en' ? 'A boutique café combining luxury, comfort, and warm hospitality' : 'Lüks, konfor ve sıcak misafirperverliği birleştiren bir butik kafe',
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {data.nav.about}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
        </div>

        {/* Description */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data.cafeInfo.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Featured Image */}
        <div className="mt-16 rounded-lg overflow-hidden shadow-lg">
          <img
            src="/manus-storage/lahfa-menu-coffee-collection_d2148824.png"
            alt="LAHFA Coffee Collection"
            className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
}
