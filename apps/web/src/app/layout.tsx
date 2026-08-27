import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Antigravity — AI Reel Editing Studio',
  description: 'AI-first reel editing studio that transforms raw creator desk videos into polished vertical reels with one prompt.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-studio-bg text-slate-100 min-h-screen antialiased selection:bg-studio-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
