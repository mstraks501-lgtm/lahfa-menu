import { MenuLanguage } from '@/data/menuData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, Star } from 'lucide-react';

interface ContactSectionProps {
  data: MenuLanguage;
}

export function ContactSection({ data }: ContactSectionProps) {
  const handleCall = () => {
    window.location.href = `tel:${data.cafeInfo.phone}`;
  };

  const handleWhatsApp = () => {
    const phoneNumber = data.cafeInfo.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {data.contact.title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto" />
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Phone Card */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{data.contact.phone}</h3>
                <p className="text-sm text-muted-foreground mb-4">{data.cafeInfo.phone}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCall}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {data.nav.contact}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleWhatsApp}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Address Card */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{data.contact.address}</h3>
                <p className="text-sm text-muted-foreground">{data.cafeInfo.address}</p>
              </div>
            </div>
          </Card>

          {/* Hours Card */}
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">{data.contact.hours}</h3>
                <p className="text-sm text-muted-foreground">{data.contact.hoursText}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Rating Card */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-accent text-accent"
                />
              ))}
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{data.cafeInfo.rating}</p>
              <p className="text-sm text-muted-foreground">Google Maps Rating</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
