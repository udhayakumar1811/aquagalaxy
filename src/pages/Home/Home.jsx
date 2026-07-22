import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/Categories";
import TopSelling from "../../components/TopSelling/TopSelling";
import OfferBanner from "../../components/OfferBanner/OfferBanner";
import Featured from "../../components/Featured/Featured";
import Gallery from "../../components/Gallery/Gallery";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <TopSelling />
      <OfferBanner />
      <Featured />
      <Gallery />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;