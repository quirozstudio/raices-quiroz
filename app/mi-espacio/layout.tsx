import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi espacio privado · Raíces",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PrivateSpaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
