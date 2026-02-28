import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Facilities from "@/components/Facilities";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import Watermark from "@/components/Watermark";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Facilities />
        <Location />
      </main>
      <Footer />
      <WhatsAppCTA />
      <Watermark />
    </>
  );
}
