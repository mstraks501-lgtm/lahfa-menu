import { MenuLanguage } from '@/data/menuData';
import { Heart } from 'lucide-react';

interface FooterProps {
  data: MenuLanguage;
}

export function Footer({ data }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground/5 border-t border-border py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg text-primary mb-2">
              {data.cafeInfo.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {data.language === 'ar'
                ? 'كافيه بوتيك فاخر في قلب سبانجا'
                : data.language === 'en'
                ? 'A luxurious boutique café in the heart of Sapanca'
                : 'Sapanca\'nın kalbinde lüks bir butik kafe'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-4">
              {data.language === 'ar'
                ? 'روابط سريعة'
                : data.language === 'en'
                ? 'Quick Links'
                : 'Hızlı Bağlantılar'}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#menu" className="hover:text-primary transition-colors">
                  {data.nav.menu}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors">
                  {data.nav.about}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">
                  {data.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-foreground mb-4">
              {data.contact.phone}
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              {data.cafeInfo.phone}
            </p>
            <p className="text-sm text-muted-foreground">
              Sapanca, Sakarya, Turkey
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            {data.language === 'ar'
              ? `© ${currentYear} لهفة - مايسون بوتيك كافيه. جميع الحقوق محفوظة.`
              : data.language === 'en'
              ? `© ${currentYear} LAHFA Maison Boutique Kafe. All rights reserved.`
              : `© ${currentYear} LAHFA Maison Boutique Kafe. Tüm hakları saklıdır.`}
          </p>
          <p className="mt-2 flex items-center justify-center gap-1">
            {data.language === 'ar'
              ? 'صنع بـ'
              : data.language === 'en'
              ? 'Made with'
              : 'Yapılmış'}
            <Heart className="h-4 w-4 text-primary fill-primary" />
            {data.language === 'ar'
              ? 'في سبانجا'
              : data.language === 'en'
              ? 'in Sapanca'
              : 'Sapanca\'da'}
          </p>
        </div>
      </div>
    </footer>
  );
}
