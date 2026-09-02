import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Практика · высшее образование',
  description: 'Обезличенная памятка по четырем веткам учебной и производственной практики: документы, договоры и проверка комплекта.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
