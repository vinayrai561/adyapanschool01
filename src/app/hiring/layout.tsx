import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post Your Task - Adyapan',
  description: 'Post micro-internship tasks and hire pre-vetted talent',
};

export default function HiringLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
