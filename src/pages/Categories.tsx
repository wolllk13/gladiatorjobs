import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoriesSection from "@/components/home/CategoriesSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Categories = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-transparent relative">
      <Header />
      <main className="pt-24 relative z-10">
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-medium text-foreground">
              {t.categories.title}
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              {t.categories.subtitle}
            </p>
          </div>
        </section>

        <CategoriesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
