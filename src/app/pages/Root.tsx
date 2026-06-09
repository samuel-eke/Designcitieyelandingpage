import { Outlet } from "react-router";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import "../../styles/fonts.css";

export function Root() {
  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-900 flex flex-col relative">
      <Navbar />
      <main className="flex-1 w-full overflow-clip">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
