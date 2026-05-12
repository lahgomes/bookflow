import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookflow",
  description: "Your personal book catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${geist.className} min-h-full bg-gray-50 text-gray-900`}>
        <nav className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm">
          <a href="/" className="text-xl font-bold text-indigo-600">📚 Bookflow</a>
          <div className="flex gap-4 text-sm">
            <a href="/" className="hover:text-indigo-600 transition-colors">Buscar</a>
            <a href="/collection" className="hover:text-indigo-600 transition-colors">Minha Coleção</a>
            <a href="/login" className="hover:text-indigo-600 transition-colors">Login</a>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
    </html>
  );
}
