import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Notion Board | Hybrid Productivity Platform',
  description: 'Unifying Notion’s structured relational document hierarchy with Trello’s spatial Kanban fluidity and Butler automation engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}

