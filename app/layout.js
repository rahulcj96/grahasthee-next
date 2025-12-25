import { Jost, Marcellus } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "./styles/vendor.css";
import "./styles/style.css";
import "./styles/swiper-arrows.css";
import "./globals.css";
import SvgIcons from "@/components/SvgIcons";
import BootstrapClient from "@/components/BootstrapClient";
import AOSClient from "@/components/AOSClient";

const jost = Jost({
  subsets: [ "latin" ],
  weight: [ "300", "400", "500", "700" ],
  variable: "--font-jost",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: [ "latin" ],
  weight: [ "400" ],
  variable: "--font-marcellus",
  display: "swap",
});

export const metadata = {
  title: "Grahasthee",
  description: "Fresh Finds for Your Home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${marcellus.variable}`} suppressHydrationWarning>
        <BootstrapClient />
        <AOSClient />
        <SvgIcons />
        {children}
      </body>
    </html>
  );
}
