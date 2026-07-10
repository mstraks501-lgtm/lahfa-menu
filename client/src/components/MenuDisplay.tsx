import { useState } from 'react';
import { MenuLanguage, MenuCategory } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MenuDisplayProps {
  data: MenuLanguage;
}

export function MenuDisplay({ data }: MenuDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <section id="menu" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {data.nav.menu}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
        </div>

        {/* Tabs Navigation */}
        <Tabs
          defaultValue={data.categories[0].id}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 mb-8 bg-transparent h-auto p-0">
            {data.categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary transition-colors"
              >
                <span className="text-lg sm:text-xl">{category.icon}</span>
                <span className="hidden sm:inline text-xs">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Menu Items */}
          {data.categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, index) => (
                  <Card
                    key={index}
                    className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-primary font-bold text-sm sm:text-base whitespace-nowrap">
                        {item.price} ر.س
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
