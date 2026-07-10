import { MenuLanguage } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  data: MenuLanguage;
  onExploreClick: () => void;
}

export function HeroSection({ data, onExploreClick }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/manus-storage/lahfa-hero-coffee-lake_a92d949b.png)',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className={`max-w-2xl ${data.direction === 'rtl' ? 'ml-auto text-right' : 'text-left'}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fade-in">
            {data.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 animate-fade-in animation-delay-100">
            {data.hero.subtitle}
          </p>
          <Button
            onClick={onExploreClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground animate-fade-in animation-delay-200"
          >
            {data.hero.cta}
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white" />
      </div>
    </section>
  );
}
