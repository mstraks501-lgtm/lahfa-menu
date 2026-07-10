import { useState, useEffect } from 'react';
import { menuData, MenuLanguage } from '@/data/menuData';

export function useLanguage() {
  const [language, setLanguage] = useState<'ar' | 'en' | 'tr'>('ar');
  const [data, setData] = useState<MenuLanguage>(menuData.ar);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('lahfa-language') as 'ar' | 'en' | 'tr' | null;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en' || savedLanguage === 'tr')) {
      setLanguage(savedLanguage);
      setData(menuData[savedLanguage]);
      document.documentElement.dir = menuData[savedLanguage].direction;
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const switchLanguage = (newLanguage: 'ar' | 'en' | 'tr') => {
    setLanguage(newLanguage);
    setData(menuData[newLanguage]);
    localStorage.setItem('lahfa-language', newLanguage);
    document.documentElement.dir = menuData[newLanguage].direction;
    document.documentElement.lang = newLanguage;
  };

  return { language, data, switchLanguage };
}
