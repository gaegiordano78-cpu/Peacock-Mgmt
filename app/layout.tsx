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
            z-index: 9999;
            transition: opacity 0.5s ease;
          }
          #splash-loader img {
            width: 65%;
            object-fit: contain;
            margin-left: 8px;
            animation: fadeInLogo 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          #splash-loader.hidden { opacity: 0; pointer-events: none; }
          @keyframes fadeInLogo {
            0% { opacity: 0; transform: scale(0.90); }
            60% { opacity: 1; }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#FFFFFF" }}>
        <div id="splash-loader">
          <img src="/logo-peacock.png" alt="Peacock" />
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          window.__hideSplash = function() {
            var el = document.getElementById('splash-loader');
            if (el) {
              el.classList.add('hidden');
              setTimeout(function() { if (el) el.remove(); }, 500);
            }
          };
        `}} />
        {children}
      </body>
    </html>
  );
}
