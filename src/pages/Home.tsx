import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBurger from '@/assets/hero-burger.jpg';
import restaurantInterior from '@/assets/restaurant-interior.jpg';
import kebabGrill from '@/assets/kebab-grill.jpg';

const Home = () => {
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroBurger})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in">
            Tians Grill
          </h1>
          <p className="text-xl md:text-2xl mb-8 fade-in max-w-2xl mx-auto">
            Välkommen till din lokala familjerestaurang där vi serverar klassisk snabbmat med kärlek och omsorg
          </p>
          <Link to="/meny">
            <Button className="btn-warm text-lg px-8 py-4 fade-in">
              Se vår meny
            </Button>
          </Link>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Öppettider */}
          <div className="card-warm p-6 text-center fade-in">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">Öppettider</h3>
            <div className="space-y-2 text-foreground">
              <p><strong>Vardagar:</strong> 10:30 – 20:00</p>
              <p><strong>Helger:</strong> 12:00 – 20:00</p>
            </div>
          </div>

          {/* Adress */}
          <div className="card-warm p-6 text-center fade-in">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">Hitta oss</h3>
            <div className="space-y-2 text-foreground">
              <p>Tians Väg 37</p>
              <p>Din stad, Sverige</p>
            </div>
          </div>

          {/* Telefon */}
          <div className="card-warm p-6 text-center fade-in">
            <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-4">Ring oss</h3>
            <div className="space-y-2 text-foreground">
              <p className="text-xl font-bold">0702 – 02 01 02</p>
              <p>Beställ eller fråga oss</p>
            </div>
          </div>
        </div>
      </section>

      {/* Om oss sektion */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Varför välja Tians Grill?</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Vi är en familjedriven restaurang som har serverat den lokala gemenskapen i många år. 
                Vår passion för mat och gästvänlighet gör varje besök till en minnesstund.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-primary" />
                  <span>Färska ingredienser varje dag</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-primary" />
                  <span>Traditionella recept med moderna smaker</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-primary" />
                  <span>Familjevänlig atmosfär</span>
                </div>
              </div>
            </div>
            <div className="fade-in">
              <img 
                src={restaurantInterior} 
                alt="Tians Grill interiör" 
                className="rounded-2xl shadow-[var(--shadow-card)] w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specialiteter */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 fade-in">Våra specialiteter</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-warm p-6 fade-in">
              <img 
                src={heroBurger} 
                alt="Tians Burger" 
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Tians Burger</h3>
              <p className="text-muted-foreground">
                Vår signaturburger med cheddar, bacon och karamelliserad lök
              </p>
            </div>
            <div className="card-warm p-6 fade-in">
              <img 
                src={kebabGrill} 
                alt="Kebab" 
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Färsk Kebab</h3>
              <p className="text-muted-foreground">
                Grillad till perfektion med våra hemliga kryddor
              </p>
            </div>
            <div className="card-warm p-6 fade-in">
              <img 
                src={restaurantInterior} 
                alt="Sallader" 
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Färska Sallader</h3>
              <p className="text-muted-foreground">
                Nyttiga alternativ med lokalt odlade grönsaker
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in">
            Besök oss idag!
          </h2>
          <p className="text-xl mb-8 fade-in">
            Vi ser fram emot att välkomna dig och din familj till Tians Grill
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <Link to="/meny">
              <Button variant="secondary" className="btn-secondary-warm">
                Se menyn
              </Button>
            </Link>
            <Link to="/kontakt">
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Kontakta oss
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;