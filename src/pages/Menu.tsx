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
              name="🔥 Tians Burger" 
              description="Högrevsburgare (170g), ost, bacon, karamelliserad lök, sallad, dressing"
              price="125:-"
            />
            <MenuItem 
              name="🍖 BBQ Burger" 
              description="Högrevsburgare (170g), ost, BBQ-sås, bacon, rödlök, sallad, dressing"
              price="125:-"
            />
            <MenuItem 
              name="🌶️ Spicy Burger" 
              description="Högrevsburgare (170g), ost, bacon, sallad, stark dressing"
              price="125:-"
            />
            <MenuItem 
              name="🍔Original Burger" 
              description="Högrevsburgare (170g), ost, sallad, tomat, röd lök, dressing"
              price="125:-"
            />
            <MenuItem 
              name="🍗 Crispy Chicken Burger" 
              description="Panerad kycklingfilé, isbergssallad, tomat, rödlök, dressing"
              price="125:-"
            />
            <MenuItem 
              name="🐟 Fiskburgare" 
              description="Panerad fiskfilé, rödlök, sallad, remouladsås"
              price="125:-"
            />
            <MenuItem 
              name="🧀 Halloumiburgare" 
              description="Grillad halloumi, tomat, rödlök, sallad, vitlökssås"
              price="125:-"
              vegetarian={true}
            />
          </div>
        </div>

        {/* Rullar */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🌯 Rullar – 110:-</h2>
          <p className="text-muted-foreground mb-6">
            Kebab, gyros, kyckling eller falafel i tunnbröd med sallad, tomat, gurka, rödlök och valfri sås. <span className="text-sm">(Kyckling serveras utan rödlök)</span>
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
            <MenuItem 
              name="🥙 Kebabsallad/Gyrossallad" 
              description="sallad, tomat, gurka, rödlök, feferoni, majs, bröd, sås"
              price="110:-" 
            />
            <MenuItem 
              name="🧀Grekisk Sallad" 
              description="fetaost, tomat, gurka, rödlök, oliver, feferoni, bröd, sås"
              price="110:-" 
            />
            <MenuItem 
              name="🍗 Kycklingsallad" 
              description="kyckling, sallad, tomat, gurka, majs, bröd, sås"
              price="110:-" 
            />
            <MenuItem 
              name="🐟 Tonfisksallad" 
              description="tonfisk, sallad, tomat, gurka, rödlök, citron, feferoni, majs, bröd, sås"
              price="110:-" 
            />
            <MenuItem 
              name="🌱 Falafelsallad" 
              description="falafel, sallad, tomat, gurka, rödlök, majs, bröd, sås"
              price="110:-" 
              vegetarian={true} 
            />
          </div>
        </div>

        {/* Pizza */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍕 Pizza</h2>
          <p className="text-muted-foreground mb-6">
            Barnpizzor 10 kr billigare!
          </p>
          <div className="space-y-4">
            <MenuItem name="1. Margherita" description="Ost" price="105:-" />
            <MenuItem name="2. Vesuvio" description="Skinka, ost" price="110:-" />
            <MenuItem name="3. Al funghi" description="Champinjoner" price="110:-" />
            <MenuItem name="4. Salami" description="Salami" price="110:-" />
            <MenuItem name="5. Calzone" description="Inbakad, skinka" price="110:-" />
            <MenuItem name="6. Capricciosa" description="Skinka, champinjoner" price="110:-" />
            <MenuItem name="7. Hawaii" description="Skinka, ananas" price="110:-" />
            <MenuItem name="8. Bussola" description="Skinka, räkor" price="115:-" />
            <MenuItem name="9. Bolognese" description="Köttfärs, lök" price="115:-" />
            <MenuItem name="10. Vegetarisk" description="Paprika, lök, oliver, champinjoner" price="115:-" vegetarian={true} />
            <MenuItem name="11. Africana" description="Skinka, banan, ananas, curry" price="120:-" />
            <MenuItem name="12. Mama mia" description="Skinka, räkor, champinjoner" price="120:-" />
            <MenuItem name="13. Atena" description="Feta ost, oliver, rödlök, feferoni" price="120:-" vegetarian={true} />
            <MenuItem name="14. Azteka" description="Skinka, tacokrydda, tacosås, jalapeños, vitlöksås" price="125:-" />
            <MenuItem name="15. Kebabpizza" description="Kebab, lök, fefferoni, valfri sås" price="125:-" />
            <MenuItem name="16. Gyrospizza" description="Gyros, lök, fefferoni, valfri sås" price="125:-" />
            <MenuItem name="17. Kycklingpizza" description="Kyckling, banan, ananas, curry" price="130:-" />
            <MenuItem name="18. Mexicana" description="Tacoköttfärs, tacosås, tacokrydda, lök, jalapeños, vitlök" price="130:-" />
            <MenuItem name="19. Quattro Stagione" description="Skinka, räkor, champinjoner, musslor" price="130:-" />
            <MenuItem name="20. Kebab-Special" description="Kebab, sallad, lök, gurka, tomat, valfri sås" price="135:-" />
            <MenuItem name="21. Torin" description="Kebab, pommes, fefferoni, valfri sås" price="135:-" />
            <MenuItem name="22. Gyros Special" description="Gyros, sallad, lök, gurka, tomat, fefferoni, valfri sås" price="135:-" />
            <MenuItem name="23. Lazio" description="Gyros, pommes, fefferoni, valfri sås" price="135:-" />
            <MenuItem name="24. Sverige" description="Oxfilé, skinka, champinjoner, lök, bearnaisesås" price="140:-" />
            <MenuItem name="25. Barcelona" description="Fläskfilé, skinka, champinjoner, lök, bearnaisesås" price="140:-" />
          </div>
        </div>

        {/* Tallrikar */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍽️ Tallrikar – 110:-</h2>
          <div className="space-y-4">
            <MenuItem 
              name="🥙 Kebabtallrik / Gyrostallrik" 
              description="Pommes, sallad, tomat, gurka, rödlök, feferoni, sås"
              price="110:-" 
            />
            <MenuItem 
              name="🍗 Kycklingtallrik" 
              description="Kyckling, pommes, sallad, tomat, gurka, sås"
              price="110:-" 
            />
            <MenuItem 
              name="🧆 Falafeltallrik" 
              description="Falafel, pommes, sallad, tomat, gurka, rödlök, sås"
              price="110:-" 
              vegetarian={true} 
            />
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
            <MenuItem name="🐟 Fiskburgare" price="79:-" />
          </div>
        </div>

        {/* Förätt */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍽️ Förätt</h2>
          <div className="space-y-4">
            <MenuItem name="🍗 Nuggets med pommes" price="69:-" />
            <MenuItem name="🥖 Vitlöksbröd" price="49:-" />
            <MenuItem name="🧀 Mozzarella sticks med pommes" price="59:-" />
            <MenuItem name="🌶️ Chili cheese med pommes" price="59:-" />
          </div>
        </div>

        {/* À la carte */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍽️ À la carte</h2>
          <div className="space-y-4">
            <MenuItem 
              name="🐖 Schnitzel" 
              description="Pommes, sallad, tomat, gurka, feferoni, bearnaisesås"
              price="120:-" 
            />
            <MenuItem 
              name="🍗Panerad Kycklingfilé" 
              description="Sallad, tomat, gurka, pommes, bearnaisesås"
              price="120:-" 
            />
            <MenuItem 
              name="🐟 Rödspätta" 
              description="Sallad, tomat, gurka, pommes, remouladsås"
              price="130:-" 
            />
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
            <MenuItem name="🧀 Chili cheese (4 st)" price="26:-" />
          </div>
        </div>

        {/* Efterrätt */}
        <div className="menu-section fade-in">
          <h2 className="text-2xl font-bold mb-4 text-primary">🍰 Efterrätt</h2>
          <div className="space-y-4">
            <MenuItem name="🥞 Pannkaka med grädde & sylt" price="39:-" />
            <MenuItem name="🍫 Kladdkaka med grädde" price="49:-" />
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