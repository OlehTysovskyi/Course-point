import HeroSection from "../components/admin/HeroSection";
import FeaturesSection from "../components/admin/FeaturesSection";
import PopularCoursesSection from "../components/admin/PopularCoursesSection";
import TestimonialsSection from "../components/admin/TestimonialsSection";
import CallToActionSection from "../components/admin/CallToActionSection";

export default function HomePage() {
  return (
    <div className="home pt-32 pb-32">
      <HeroSection />
      <FeaturesSection />
      <PopularCoursesSection />
      <TestimonialsSection />
      <CallToActionSection />
    </div>
  );
}
