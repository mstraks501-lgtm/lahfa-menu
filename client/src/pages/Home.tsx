import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { MenuDisplay } from '@/components/MenuDisplay';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const { language, data, switchLanguage } = useLanguage();

  // Set document direction and language on mount and when language changes
  useEffect(() => {
    document.documentElement.dir = data.direction;
    document.documentElement.lang = language;
  }, [language, data]);

  const handleExploreClick = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        data={data}
        currentLanguage={language}
        onLanguageChange={switchLanguage}
      />

      <main className="flex-1">
        <HeroSection data={data} onExploreClick={handleExploreClick} />
        <AboutSection data={data} />
        <MenuDisplay data={data} />
        <ContactSection data={data} />
      </main>

      <Footer data={data} />
    </div>
  );
}
