import { useEffect, useRef } from 'react';
import { MapPin, Phone, Utensils, Mail } from 'lucide-react';

const Contact = () => {
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
    <div className="min-h-screen pt-8 pb-16">
      {/* Header */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">Kontakta oss</h1>
          <p className="text-xl text-muted-foreground fade-in">
            Här hittar du all information du behöver för att besöka eller kontakta oss.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4">
        {/* Contact Information */}
        <div className="card-warm p-8 fade-in">
          <h2 className="text-3xl font-bold mb-8 text-primary text-center">Restaurang information</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Adress</h3>
                  <p className="text-muted-foreground">
                    Tiansväg 37<br />
                    29531 Bromölla
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <p className="text-muted-foreground">070 202 01 02</p>
                  <p className="text-sm text-muted-foreground">Ring oss för beställningar</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">E-post</h3>
                  <p className="text-muted-foreground">tiansgril@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Utensils className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Servering & Upphämtning</h3>
                  <p className="text-muted-foreground">
                    Vi erbjuder både servering i restaurangen och upphämtning av mat – välkommen att beställa på plats eller via telefon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="card-warm p-8 text-center mt-12 fade-in">
          <h2 className="text-2xl font-bold mb-6 text-primary">Välkommen till Tians Grill!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Vi ser fram emot att välkomna dig till vår restaurang i Bromölla. Kom förbi under våra öppettider eller ring för beställning.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-semibold mb-2">Vardagar</h4>
              <p className="text-muted-foreground">11:00 – 20:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Helger</h4>
              <p className="text-muted-foreground">12:00 – 20:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Telefon</h4>
              <p className="text-primary font-bold">070 202 01 02</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;