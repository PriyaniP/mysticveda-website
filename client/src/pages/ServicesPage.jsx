import { useEffect, useState } from "react";
import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import { api } from "../lib/api";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.getServices();
        setServices(data.services);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <section className="section-shell py-16 md:py-20">
      <SEO
        title="Astrology, Numerology, Tarot & Healing Services | Mystic Veda"
        description="Explore our online services — astrology readings, numerology reports, tarot guidance, chakra balancing, YPV healing & manifestation coaching."
        path="/services"
        keywords="astrology reading online, numerology report, tarot reading, chakra balancing, YPV healing, energy healing sessions, manifestation coaching"
      />
      <SectionHeading
        eyebrow="Services"
        title="Find the experience that resonates with your current phase"
        description="All sessions are mindfully designed, intuitively guided, and focused on bringing clarity, calm, and energetic realignment."
      />

      {loading ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-[28px] bg-white/70 shadow-card"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-12 rounded-[24px] border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ServicesPage;
