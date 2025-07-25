import { useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';

const Menu = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const MenuItem = ({ name, description, price, vegetarian = false }: {
    name: string;
    description?: string;
    price: string;
    vegetarian?: boolean;
  }) => (
    <div className="menu-item border-b border-border last:border-b-0 pb-4 last:pb-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-foreground">{name}</h4>
          {vegetarian && <Leaf className="w-4 h-4 text-green-600" />}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <span className="font-bold text-primary">{price}</span>
    </div>
  );

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Header */}
      <section className="py-16 px-4 text-center bg-muted">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">Vår Meny</h1>
          <p className="text-xl text-muted-foreground fade-in mb-8">
            Upptäck våra läckra rätter tillagade med kärlek och de bästa ingredienserna
          </p>
          <div className="card-warm p-6 max-w-2xl mx-auto fade-in">
            <h2 className="text-2xl font-bold text-primary mb-2">🍔 Tians Grill</h2>
            <p className="mb-2">📍 Tians Väg 37</p>
            <p className="mb-2">📞 Tel: 0702 – 02 01 02</p>
            <p>🕒 Öppet: Vardagar 10:30 – 20:00 / Helger 12:00 – 20:00</p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Burger Menu */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍔 Burger meny – 125:-</h2>
          <p className="text-muted-foreground mb-6">
            Alla våra hamburgare är gjorda på 170 g högrev och serveras i briochebröd och med krispiga pommes frites.
          </p>
          <div className="space-y-4">
            <MenuItem 
              name="Tians Burger" 
              description="cheddar, bacon, karamelliserad lök, sallad, dressing"
              price="125:-"
            />
            <MenuItem 
              name="BBQ Burger" 
              description="cheddar, bacon, BBQ-sås, rödlök, sallad, dressing"
              price="125:-"
            />
            <MenuItem 
              name="Spicy Burger" 
              description="cheddar, bacon, jalapeños, rödlök, sallad, dressing"
              price="125:-"
            />
            <MenuItem 
              name="Crispy Chicken Burger" 
              description="panerad kycklingfilé, sallad, tomat, dressing"
              price="125:-"
            />
            <MenuItem 
              name="Fiskburgare" 
              description="panerad fiskfilé, rödlök, sallad, remouladsås"
              price="125:-"
            />
            <MenuItem 
              name="Halloumiburgare" 
              description="halloumi, tomat, rödlök, sallad, vitlökssås"
              price="125:-"
              vegetarian={true}
            />
          </div>
        </div>

        {/* Rullar */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🌯 Rullar – 110:-</h2>
          <p className="text-muted-foreground mb-6">
            Kebab, gyros, kyckling eller falafel i tunnbröd med sallad och valfri sås
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-warm p-4">
              <h4 className="font-semibold mb-2">Kött alternativ:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Kebab</li>
                <li>• Gyros</li>
                <li>• Kyckling</li>
              </ul>
            </div>
            <div className="card-warm p-4">
              <h4 className="font-semibold mb-2">Vegetariskt:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Falafel <Leaf className="inline w-4 h-4 text-green-600" /></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sallader */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🥗 Sallader – 110:-</h2>
          <div className="space-y-4">
            <MenuItem name="Kebabsallad / Gyrossallad" price="110:-" />
            <MenuItem name="Grekisk Sallad" price="110:-" />
            <MenuItem name="Kycklingsallad" price="110:-" />
            <MenuItem name="Tonfisksallad" price="110:-" />
            <MenuItem name="Falafelsallad" price="110:-" vegetarian={true} />
          </div>
        </div>

        {/* Tallrikar */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍽️ Tallrikar – 110:-</h2>
          <p className="text-muted-foreground mb-6">
            Serveras med pommes, grönsaker och valfri sås
          </p>
          <div className="space-y-4">
            <MenuItem name="Kebabtallrik / Gyrostallrik" price="110:-" />
            <MenuItem name="Kycklingtallrik" price="110:-" />
            <MenuItem name="Falafeltallrik" price="110:-" vegetarian={true} />
          </div>
        </div>

        {/* Barnmeny */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">👶 Barnmeny</h2>
          <p className="text-muted-foreground mb-6">
            Alla barnrätter inkluderar pommes eller potatismos + en liten Festis 🧃
          </p>
          <div className="space-y-4">
            <MenuItem name="Cheeseburgare" price="79:-" />
            <MenuItem name="Chicken Nuggets (6 st)" price="69:-" />
            <MenuItem name="Grillad korv" price="49:-" />
          </div>
        </div>

        {/* Korvmeny */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🌭 Korvmeny</h2>
          <div className="space-y-4">
            <MenuItem name="Korv med bröd" price="20:-" />
            <MenuItem name="Tunnbrödsrulle" price="79:-" />
            <MenuItem name="Bamsekorv" price="39:-" />
            <MenuItem name="Chorizo" price="39:-" />
            <MenuItem 
              name="Ost & Bacon Korv" 
              description="En smakrik korv fylld med ost och bacon – grillad till perfektion."
              price="30:-" 
            />
            
          </div>
        </div>

        {/* À la carte */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍽️ À la carte</h2>
          <div className="space-y-4">
            <MenuItem name="Schnitzel" price="120:-" />
            <MenuItem name="Rödspätta" price="130:-" />
            <MenuItem name="Panerad Kycklingfilé" price="120:-" />
          </div>
        </div>

        {/* Tillbehör */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍟 Tillbehör</h2>
          <div className="space-y-4">
            <MenuItem name="Dipsås" price="12:-" />
            <MenuItem name="Lökringar (4 st)" price="20:-" />
            <MenuItem name="Mozzarella sticks (4 st)" price="25:-" />
            <MenuItem name="Pommestallrik" price="39:-" />
          </div>
        </div>

        {/* Allergi info */}
        <div className="card-warm p-6 text-center fade-in mt-8">
          <h3 className="text-xl font-bold mb-3 text-primary">⚠️ Allergier?</h3>
          <p className="text-muted-foreground">
            Fråga personalen! Vi hjälper dig gärna att hitta rätt alternativ. 🙂
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;