import { FireduxProvider } from "./providers";

export const metadata = { title: "firedux-storage — Next.js" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FireduxProvider>{children}</FireduxProvider>
      </body>
    </html>
  );
}
