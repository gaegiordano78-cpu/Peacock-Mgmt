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
          html, body { margin: 0; padding: 0; background: #FFFFFF; }
          #splash-loader {
            position: fixed; inset: 0; background: #FFFFFF;
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; transition: opacity 0.3s;
          }
          #splash-loader img { width: 60%; padding-left: 11%; object-fit: contain; }
          #splash-loader.hidden { opacity: 0; pointer-events: none; }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#FFFFFF" }}>
        <div id="splash-loader">
          <img src="/logo-peacock.png" alt="Peacock" />
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            setTimeout(function() {
              var el = document.getElementById('splash-loader');
              if (el) el.classList.add('hidden');
              setTimeout(function() { if (el) el.remove(); }, 300);
            }, 400);
          });
        `}} />
        {children}
      </body>
    </html>
  );
}
