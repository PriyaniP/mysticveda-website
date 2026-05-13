import { Helmet } from "react-helmet-async";

const SITE_URL = "https://mysticveda-holistic-studio.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

function SEO({
  title = "Online Astrology, Numerology, Tarot & YPV Healing | Mystic Veda",
  description = "Get online astrology, numerology, tarot readings & YPV healing. Personalized guidance for clarity, career, relationships & energy healing worldwide.",
  path = "/",
  image = DEFAULT_IMAGE,
  keywords = "online astrology reading, numerology reading online, tarot reading online, YPV healing, energy healing, chakra balancing, manifestation coaching, mystic veda"
}) {
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Mystic Veda Holistic Studio" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@mystiicveda" />
    </Helmet>
  );
}

export default SEO;
