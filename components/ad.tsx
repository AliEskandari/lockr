import Script from "next/script";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function Ad() {
  const router = useRouter();
  const { isReady } = router;
  const loaded = useRef(false);

  useEffect(() => {
    if (!isReady || loaded.current) return;
    try {
      loaded.current = true;
      let windowWithAds: any = window;
      (windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, [isReady]);

  return (
    <>
      <Script
        onLoad={() => console.log("script loaded")}
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4875892636338399"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle bg-gray-100 dark:bg-gray-800 rounded-xl !w-full !m-0 !z-0 !h-[280px]"
        style={{
          display: "block",
        }}
        data-ad-client="ca-pub-4875892636338399"
        data-ad-slot="2244128222"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
}
