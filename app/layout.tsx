import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Навигатор по практике · высшее образование',
  description: 'Обезличенная памятка по учебной и производственной практике: документы, договоры и проверка комплекта.',
  icons: { icon: '/practice-logo.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
