import "./globals.css";

export const metadata = {
  title: "SMM Panel Pro",
  description: "Modern social media marketing panel with secure ordering and provider API integration."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
