import Script from "next/script";

const THEME_INIT = `try {
  var t = localStorage.getItem("gh-admin-theme");
  var d = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (d) document.documentElement.classList.add("dark");
} catch (e) {}`;

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="gh-admin-theme-init" strategy="beforeInteractive">
        {THEME_INIT}
      </Script>
      {children}
    </>
  );
}