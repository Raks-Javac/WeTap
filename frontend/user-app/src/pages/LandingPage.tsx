import DetailedFeatures from "../components/DetailedFeatures";
import FeatureGrid from "../components/FeatureGrid";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import NFCAnimation from "../components/NFCAnimation";
import SecurityPositioning from "../components/SecurityPositioning";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative bg-[var(--color-bg-primary)] overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 space-y-24 pb-24">
        <HeroSection />

        <div id="nfc">
          <NFCAnimation />
        </div>

        <div id="features">
          <FeatureGrid />
        </div>

        <div>
          <DetailedFeatures />
        </div>

        <div id="security">
          <SecurityPositioning />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
