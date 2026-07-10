import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { HeaderNew } from '@/components/HeaderNew';
import { CategoriesGrid } from '@/components/CategoriesGrid';
import { CategoryDetails } from '@/components/CategoryDetails';

export default function Home() {
  const { language, data, switchLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Set document direction and language on mount and when language changes
  useEffect(() => {
    document.documentElement.dir = data.direction;
    document.documentElement.lang = language;
  }, [language, data]);

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <HeaderNew
        currentLanguage={language}
        onLanguageChange={switchLanguage}
        onBack={handleBack}
        showBack={selectedCategory !== null}
      />

      <main className="flex-1">
        {selectedCategory ? (
          <CategoryDetails categoryId={selectedCategory} language={language} data={data} />
        ) : (
          <CategoriesGrid language={language} onSelectCategory={setSelectedCategory} />
        )}
      </main>
    </div>
  );
}
