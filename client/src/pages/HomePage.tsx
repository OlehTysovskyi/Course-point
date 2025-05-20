import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import PopularCoursesSection from "../components/PopularCoursesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import CallToActionSection from "../components/CallToActionSection";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home pb-32">
      <HeroSection />
      <FeaturesSection />
      <PopularCoursesSection />
      <TestimonialsSection />
      {!isAuthenticated && <CallToActionSection />}
    </div>
  );
}
