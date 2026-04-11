import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Peacock Mgmt",
  description: "Peacock Models Management",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Peacock",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Peacock" />
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            background: #FFFFFF;
          }
          #__next {
            background: #FFFFFF;
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#FFFFFF" }}>{children}</body>
    </html>
  );
}
