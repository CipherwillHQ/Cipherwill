
import { AuthProvider } from "../contexts/AuthContext";
import { ApolloContext } from "../contexts/ApolloContext";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import { UserSetupProvider } from "../contexts/UserSetupContext";
import { gilroy, PlayfairDisplay } from "./font";
import { FULL_HOSTNAME, IS_PRODUCTION } from "@/common/constant";
import { MixpanelProvider } from "@/contexts/MixpanelContext";
import { CSPostHogProvider } from "@/contexts/CSPostHogProvider";
import dynamic from "next/dynamic";
import Head from "next/head";
import DynamicToaster from "@/components/common/DynamicToaster";

// This works with dynamic imports to lower LCP
const CSSImporter = dynamic(() => import("@/components/CSSImporter"));

const title = "Cipherwill - Dead Man's Switch for Digital Assets";
const description =
  "Secure your digital assets with Cipherwill's Dead Man's Switch. Ensure seamless transfer of critical information to your beneficiaries. Protect your legacy today!";
export const metadata: Metadata = {
  title,
  description,
  manifest: "/manifest.json",
  applicationName: "Cipherwill",
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/`,
  },
  appleWebApp: {
    title: "Cipherwill",
  },
  robots: {
    index: IS_PRODUCTION,
  },
  metadataBase: new URL("https://www.cipherwill.com"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="theme-color" content="#FFFFFF" />
      {/* <meta
        name="adopt-website-id"
        content="b339be64-92db-44ef-a97a-bb6470fbd9f5"
      /> */}
      {process.env.NEXT_PUBLIC_BUILD_ENV === "production" && (
        <>
          {/* globalThis is not defined polyfill */}
          <Script id="globalthis-polyfill" defer>
            {`!function(t) {
                function e() {
                    var e = this || self;
                    e.globalThis = e;
                    delete t.prototype._T_;
                }
                "object" != typeof globalThis && (this ? e() : (t.defineProperty(t.prototype, "_T_", {
                    configurable: true,
                    get: e
                }), _T_));
              }(Object);`}
          </Script>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-RZFF8FN4JG"
            defer
          />
          <Script id="google-analytics" defer>
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-RZFF8FN4JG');    
            gtag('config', 'AW-10979832873');
            function GoogleConverted(){
              gtag('event', 'cipherwill-signup');
              gtag('event', 'conversion', {'send_to': 'AW-10979832873/s7WkCKDP-8IZEKnoy_Mo'});
            }
            window.GoogleConverted = GoogleConverted;  
  
        `}
          </Script>
          {/* AdOpt Cookie Manager */}
          {/* <Script
            id="cookie-manager"
            src="//tag.goadopt.io/injector.js?website_code=b339be64-92db-44ef-a97a-bb6470fbd9f5"
            className="adopt-injector"
            defer
          ></Script> */}
          {/* Microsoft Ads */}
          {/* <Script id="ms-ads" strategy="lazyOnload">
            {`
             (function(w,d,t,r,u)
              {
                  var f,n,i;
                  w[u]=w[u]||[],f=function()
                  {
                      var o={ti:"187137380", enableAutoSpaTracking: true};
                      o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
                  },
                  n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function()
                  {
                      var s=this.readyState;
                      s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
                  },
                  i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
              })(window,document,"script","//bat.bing.com/bat.js","uetq");
            `}
          </Script> */}
        </>
      )}
      <body
        className={`${gilroy.className} ${PlayfairDisplay.variable} bg-white text-black customScrollbar`}
      >
        {process.env.NEXT_PUBLIC_BUILD_ENV !== "production" &&
          process.env.NEXT_PUBLIC_BUILD_ENV !== "development" && (
            <div className="bg-yellow-500/80 fixed top-6 -left-32 p-1 -rotate-45 z-9999 text-white text-xs uppercase w-80 text-center">
              {process.env.NEXT_PUBLIC_BUILD_ENV}
            </div>
          )}
        <DynamicToaster position="top-right" />
        <MixpanelProvider>
          <AuthProvider>
            <CSPostHogProvider>
              <ApolloContext>
                <UserSetupProvider>
                  {/* <StripeContext> */}
                  {children}
                  {/* </StripeContext> */}
                </UserSetupProvider>
              </ApolloContext>
            </CSPostHogProvider>
          </AuthProvider>
        </MixpanelProvider>
      </body>
    </html>
  );
}
