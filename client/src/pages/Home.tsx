import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useMenuStorage } from '@/hooks/useMenuStorage';
import { HeaderNew } from '@/components/HeaderNew';
import { CategoriesGridReal } from '@/components/CategoriesGridReal';
import { CategoryDetailsReal } from '@/components/CategoryDetailsReal';

export default function Home() {
  const { language, switchLanguage } = useLanguage();
  const { isLoaded } = useMenuStorage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

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
