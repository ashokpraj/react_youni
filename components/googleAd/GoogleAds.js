import React, { useEffect } from "react";

const GoogleAds = () => {
  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-6596882406101886"
      data-ad-slot="9667687323"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default GoogleAds;
