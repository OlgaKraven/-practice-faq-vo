import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Практика без паники',
  description: 'Понятный чек-лист по учебной и производственной практике: сроки, документы и частые вопросы.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
