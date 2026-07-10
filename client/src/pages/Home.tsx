import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { HeaderNew } from '@/components/HeaderNew';
import { CategoriesGridReal } from '@/components/CategoriesGridReal';
import { CategoryDetailsReal } from '@/components/CategoryDetailsReal';

export default function Home() {
  const { language, switchLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Set document direction and language on mount and when language changes
  useEffect(() => {
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <HeaderNew
        currentLanguage={language as 'ar' | 'en' | 'tr'}
        onLanguageChange={(lang) => switchLanguage(lang as 'ar' | 'en' | 'tr')}
        onBack={handleBack}
        showBack={selectedCategory !== null}
      />

      <main className="flex-1">
        {selectedCategory ? (
          <CategoryDetailsReal categoryId={selectedCategory} language={language as 'ar' | 'en'} />
        ) : (
          <CategoriesGridReal language={language as 'ar' | 'en'} onSelectCategory={setSelectedCategory} />
        )}
      </main>
    </div>
  );
}
