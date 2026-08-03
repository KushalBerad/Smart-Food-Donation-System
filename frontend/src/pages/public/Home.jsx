import Features from "../../components/home/Features";
import Footer from "../../components/home/Footer";
import Hero from "../../components/home/Hero";
import HomeNavbar from "../../components/home/HomeNavbar";
import HowItWorks from "../../components/home/HowItWorks";
import Mission from "../../components/home/Mission";
import Stats from "../../components/home/Stats";

export default function Home() {
    return (
        <div className="min-h-screen bg-white">

            <HomeNavbar />

            <Hero />

            <Stats />

            <HowItWorks />

            <Features />

            <Mission />

            <Footer />

        </div>
    );
}