import { useEffect, useRef } from 'react';
import { Heart, Users, Award, Clock } from 'lucide-react';
import restaurantInterior from '@/assets/restaurant-interior.jpg';
import kebabGrill from '@/assets/kebab-grill.jpg';

const About = () => {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">Om Tians Grill</h1>
          <p className="text-xl text-muted-foreground fade-in">
            En berättelse om familj, kärlek och autentisk svensk snabbmat
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <img 
                src={restaurantInterior} 
                alt="Tians Grill restaurang" 
                className="rounded-2xl shadow-[var(--shadow-card)] w-full h-auto"
              />
            </div>
            <div className="fade-in">
              <h2 className="text-3xl font-bold mb-6">Vår historia</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Tians Grill är ett nystartat företag i Bromölla med stor passion för matlagning och klassisk snabbmat. Vi startade med en enkel vision: att skapa en plats där lokala familjer kan komma för god mat, värme och gemenskap.
              </p>
              <p className="text-lg mb-6 text-muted-foreground">
                Som ett nytt företag i området strävar vi efter att bli en naturlig del av det lokala samhället. Vi tror på att servera varje gäst med samma passion och omsorg som vi hade från första dagen.
              </p>
              <p className="text-lg text-muted-foreground">
                Varje rätt tillagas med kärlek och de bästa ingredienserna vi kan hitta. Vi tror att god mat skapar goda minnen och starka relationer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 fade-in">Våra värderingar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-warm p-6 text-center fade-in">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Kärlek till mat</h3>
              <p className="text-muted-foreground">
                Varje rätt tillagas med passion och omsorg för att ge dig den bästa smakupplevelsen.
              </p>
            </div>
            <div className="card-warm p-6 text-center fade-in">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Familjeanda</h3>
              <p className="text-muted-foreground">
                Vi behandlar alla våra gäster som familj och skapar en varm, välkomnande atmosfär.
              </p>
            </div>
            <div className="card-warm p-6 text-center fade-in">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Kvalitet</h3>
              <p className="text-muted-foreground">
                Vi använder endast de bästa ingredienserna och håller högsta standard på allt vi serverar.
              </p>
            </div>
            <div className="card-warm p-6 text-center fade-in">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Tradition</h3>
              <p className="text-muted-foreground">
                Våra recept har utvecklats över tid och kombinerar traditionella tekniker med moderna smaker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Story */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h2 className="text-3xl font-bold mb-6">Vårt team</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                Bakom Tians Grill står ett dedikerat team av matälskare som arbetar tillsammans för att ge dig den bästa upplevelsen varje gång du besöker oss.
              </p>
              <p className="text-lg mb-6 text-muted-foreground">
                Som ett nytt företag i Bromölla strävar vi efter att bygga nära relationer med våra gäster. Vi vill lära känna dig och vad du gillar att beställa.
              </p>
              <p className="text-lg text-muted-foreground">
                Det är den här personliga touchen som gör Tians Grill mer än bara en restaurang - vi vill vara en del av samhället.
              </p>
            </div>
            <div className="fade-in">
              <img 
                src={kebabGrill} 
                alt="Tians Grill kök" 
                className="rounded-2xl shadow-[var(--shadow-card)] w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in">
            Vår mission
          </h2>
          <p className="text-xl mb-8 fade-in">
            Att vara mer än bara en restaurang - vi vill vara platsen där vänner träffas, familjer samlas och goda minnen skapas över en utsökt måltid.
          </p>
          <div className="card-warm p-8 mx-auto max-w-2xl fade-in">
            <p className="text-xl font-medium text-foreground italic">
              "Vi tror att god mat skapar goda relationer, och goda relationer skapar ett starkt samhälle."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;