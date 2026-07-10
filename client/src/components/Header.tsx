import { MenuLanguage } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface HeaderProps {
  data: MenuLanguage;
  currentLanguage: 'ar' | 'en' | 'tr';
  onLanguageChange: (lang: 'ar' | 'en' | 'tr') => void;
}

export function Header({ data, currentLanguage, onLanguageChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/manus-storage/lahfa-logo_c995ec88.png"
            alt="LAHFA Logo"
            className="h-10 w-10"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-primary">{data.cafeInfo.name}</h1>
            <p className="text-xs text-muted-foreground">Sapanca, Turkey</p>
          </div>
        </div>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{data.language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={data.direction === 'rtl' ? 'start' : 'end'}>
            <DropdownMenuItem
              onClick={() => onLanguageChange('ar')}
              className={currentLanguage === 'ar' ? 'bg-accent' : ''}
            >
              العربية
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onLanguageChange('en')}
              className={currentLanguage === 'en' ? 'bg-accent' : ''}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onLanguageChange('tr')}
              className={currentLanguage === 'tr' ? 'bg-accent' : ''}
            >
              Türkçe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
