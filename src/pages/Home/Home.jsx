import React from "react";
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