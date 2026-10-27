import Seo from "../../components/Seo/Seo";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/Categories";
import TopSelling from "../../components/TopSelling/TopSelling";
import OfferBanner from "../../components/OfferBanner/OfferBanner";
import Gallery from "../../components/Gallery/Gallery";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <>
      <Seo
        title="UDHAYA AQUATICS — Live Aquarium Fish, Tanks & Aquatic Pets Online in India"
        description="Shop healthy ornamental fish, customized aquariums, live plants, and aquatic supplies online from UDHAYA AQUATICS, Rajapalayam, Tamil Nadu. Fast and safe delivery across India."
        canonical={window.location.origin + "/"}
      />
      <Hero />
      <Categories />
      <TopSelling />
      <OfferBanner />
      <Gallery />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;