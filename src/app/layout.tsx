import { JetBrains_Mono, Press_Start_2P } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500"],
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: "400",
});

export const metadata = {
  title: "Relationship Memory",
  description: "Personal relationship memory for event networking — capture, triage, recall.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrainsMono.variable} ${pressStart.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
