import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, ArrowRight, ArrowLeft } from 'lucide-react';

interface HeaderNewProps {
  currentLanguage: 'ar' | 'en' | 'tr';
  onLanguageChange: (lang: 'ar' | 'en' | 'tr') => void;
  onBack?: () => void;
  showBack?: boolean;
}

export function HeaderNew({ currentLanguage, onLanguageChange, onBack, showBack = false }: HeaderNewProps) {
  const isRTL = currentLanguage === 'ar';

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-accent hover:bg-secondary"
            >
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>
          )}
          <div>
            <h1 className="text-xl font-bold text-accent">LAHFA</h1>
            <p className="text-xs text-muted-foreground">Sapanca</p>
          </div>
        </div>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border hover:bg-secondary"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">
                {currentLanguage === 'ar' ? 'العربية' : currentLanguage === 'en' ? 'EN' : 'TR'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="bg-card border-border">
            <DropdownMenuItem
              onClick={() => onLanguageChange('ar')}
              className={`cursor-pointer ${currentLanguage === 'ar' ? 'bg-secondary' : ''}`}
            >
              العربية
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onLanguageChange('en')}
              className={`cursor-pointer ${currentLanguage === 'en' ? 'bg-secondary' : ''}`}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onLanguageChange('tr')}
              className={`cursor-pointer ${currentLanguage === 'tr' ? 'bg-secondary' : ''}`}
            >
              Türkçe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
