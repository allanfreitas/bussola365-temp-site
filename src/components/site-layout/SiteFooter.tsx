import { Instagram, SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-prussian-blue-950 border-t border-prussian-blue-900 py-16 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-apenas-icone-120x120.png"
                alt="Bússola365 Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold text-white">Bússola365</span>
            </div>
            <p className="text-iron-grey-400 max-w-xs leading-relaxed">
              Norteando suas finanças com simplicidade e tecnologia diretamente
              de onde você já está.
            </p>
          </div>

          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/bussola365"
              target="_blank"
              className="w-10 h-10 rounded-full bg-prussian-blue-900 flex items-center justify-center hover:bg-jungle-green-500 hover:text-prussian-blue-950 transition-all"
            >
              <Instagram className="w-5 h-5" />
            </a>
            {/* <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-prussian-blue-900 flex items-center justify-center hover:bg-jungle-green-500 hover:text-prussian-blue-950 transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a> */}
          </div>
        </div>

        <div className="pt-8 border-t border-prussian-blue-900 flex flex-col md:flex-row justify-between gap-6 text-sm text-iron-grey-500">
          <div>
            <p className="font-semibold text-platinum-300 mb-1">
              Produto da Empresa Algolity Soluções
            </p>
            <p>CNPJ: 37.527.475/0001-40</p>
            <p className="flex items-center gap-1">
              <a
                href="https://www.algolity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-jungle-green-500 transition-colors underline underline-offset-4 cursor-pointer pr-1"
              >
                https://www.algolity.com
              </a>
              <SquareArrowOutUpRightIcon className="w-4 h-4" />
            </p>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href={"/termos-de-uso"}
              className="hover:text-jungle-green-500 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Termos de Uso
            </Link>
            <Link
              href={"/politica-de-privacidade"}
              className="hover:text-jungle-green-500 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Privacidade
            </Link>
            <p>&copy; 2025 Bússola365. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
