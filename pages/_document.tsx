import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html id="html" className="!mt-0">
      {/* ^ !static: fix modal hiding and bg issue */}
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4875892636338399"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body id="body" className="dark:bg-gray-900 dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
