import {
  BriefcaseBusiness,
  Github,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import { useState } from "react";

const ConnectionModal = () => {
  return (
    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sidebar border text-foreground p-2 z-10 w-max">
      <div className="grid grid-cols-2 gap-5 p-2">
        <a
          href="https://www.linkedin.com/in/mallarB/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin />
        </a>
        <a
          href="https://github.com/mallar-B"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
        </a>
        <a
          href="https://x.com/mallar_Bh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter />
        </a>
        <a
          href="mailto:bhattacharyamallar@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail />
        </a>
      </div>
    </div>
  );
};

const Footer = () => {
  const [connectOpen, setConnectOpen] = useState(false);
  return (
    <footer className="w-full flex flex-col-reverse gap-4 md:justify-between items-center absolute bottom-0 text-center pt-2 border-t text-sm text-muted-foreground px-4 sm:px-8 md:px-12 xl:px-[10%] 2xl:px-64 backdrop-blur-xl">
      {/* DUmmy element */}
      <div className="w-48 hidden lg:block"></div>
      <p>© 2025 Mallar Bhattacharya. All rights reserved.</p>
      <div className="flex justify-center space-x-4">
        <div className="relative group">
          <a
            href="https://github.com/mallar-B/packet-send"
            className="transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
          </a>
          {/*Tooltip*/}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sidebar border text-foreground text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            Source Code
          </div>
        </div>

        <div className="relative group">
          <a
            href="https://portfolio-mallar.vercel.app"
            className="transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BriefcaseBusiness />
          </a>
          {/*Tooltip*/}
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sidebar border text-foreground text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            Portfolio
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => setConnectOpen((state) => !state)}
            className="transition cursor-pointer"
          >
            <Phone />
          </button>
          {connectOpen ? (
            <ConnectionModal />
          ) : (
            // Tooltip
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sidebar border text-foreground text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              Connect
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
