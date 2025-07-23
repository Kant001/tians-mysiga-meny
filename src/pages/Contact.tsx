import { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Meddelande skickat!",
      description: "Tack för ditt meddelande. Vi återkommer så snart som möjligt.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      {/* Header */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">Kontakta oss</h1>
          <p className="text-xl text-muted-foreground fade-in">
            Vi älskar att höra från våra gäster. Kontakta oss för beställningar, frågor eller bara för att säga hej!
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Restaurant Info */}
            <div className="card-warm p-6 fade-in">
              <h2 className="text-2xl font-bold mb-6 text-primary">Restaurang information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Adress</h3>
                    <p className="text-muted-foreground">
                      Tians Väg 37<br />
                      123 45 Din Stad<br />
                      Sverige
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Telefon</h3>
                    <p className="text-muted-foreground">0702 – 02 01 02</p>
                    <p className="text-sm text-muted-foreground">Ring oss för beställningar eller frågor</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">E-post</h3>
                    <p className="text-muted-foreground">info@tiansgrill.se</p>
                    <p className="text-sm text-muted-foreground">Vi svarar inom 24 timmar</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Öppettider</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p><strong>Måndag - Fredag:</strong> 10:30 – 20:00</p>
                      <p><strong>Lördag - Söndag:</strong> 12:00 – 20:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card-warm p-6 fade-in">
              <h3 className="text-xl font-bold mb-4 text-primary">Hitta oss</h3>
              <div className="bg-muted rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Interaktiv karta</p>
                  <p className="text-sm">Tians Väg 37, Din Stad</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-warm p-6 fade-in">
            <h2 className="text-2xl font-bold mb-6 text-primary">Skicka ett meddelande</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Namn *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ditt namn"
                  className="rounded-xl border-border"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  E-post *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="din.epost@exempel.se"
                  className="rounded-xl border-border"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Meddelande *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Skriv ditt meddelande här..."
                  className="rounded-xl border-border min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                className="btn-warm w-full flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Skicka meddelande</span>
              </Button>
            </form>

            <div className="mt-8 p-4 bg-muted rounded-xl">
              <h4 className="font-semibold mb-2">Beställningar</h4>
              <p className="text-sm text-muted-foreground">
                För snabbare service, ring oss direkt på <strong>0702 – 02 01 02</strong> för att beställa mat för avhämtning.
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours Card */}
        <div className="card-warm p-8 text-center mt-12 fade-in">
          <h2 className="text-2xl font-bold mb-6 text-primary">Kom och besök oss!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Vi ser fram emot att välkomna dig till Tians Grill. Kom förbi under våra öppettider eller ring för beställning.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-semibold mb-2">Vardag</h4>
              <p className="text-muted-foreground">10:30 – 20:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Helger</h4>
              <p className="text-muted-foreground">12:00 – 20:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Telefon</h4>
              <p className="text-primary font-bold">0702 – 02 01 02</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;