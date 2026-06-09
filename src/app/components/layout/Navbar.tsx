import { ResizableNavbar } from "../ui/resizable-navbar";

export function Navbar() {
  return (
    <>
      {/* Spacer for the fixed navbar */}
      <div className="h-24 w-full bg-white"></div>
      <ResizableNavbar />
    </>
  );
}
