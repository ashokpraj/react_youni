import React, { useEffect, useState } from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";
import "../style/assets/css/custom.css";
import "../style/assets/css/responsive.css";
import "@fullcalendar/common/main.css";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "../pages/ProtectedRoute";
import Footer from "../components/layout/Footer";
import Validateuser from "../components/validateuser/Validateuser";
import { useRouter } from "next/router";

// export const registerServiceWorker = () => {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('firebase-messaging-sw.js')
//       .then(function (registration) {
//         // eslint-disable-next-line no-console
//         console.log('[SW]: SCOPE: ', registration.scope);
//         return registration.scope;
//       })
//       .catch(function (err) {
//         return err;
//       });
//   }
// };

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkPaths = !router.asPath;
    // console.log("router.asPath::;;", router.asPath);
    // if (!router.asPath) {
    //   router.push("/notfound");
    // }
    // const handleStart = (url) => url !== router.asPath && setLoading(true);

    // const handleComplete = (url) =>
    //   url === router.asPath &&
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 500);

    // router.events.on("routeChangeStart", handleStart);
    // router.events.on("routeChangeComplete", handleComplete);
    // router.events.on("routeChangeError", handleComplete);

    // return () => {
    //   router.events.off("routeChangeStart", handleStart);
    //   router.events.off("routeChangeComplete", handleComplete);
    //   router.events.off("routeChangeError", handleComplete);
    // };
  });

  return (
    loading && (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    )
  );
}

export default function MyApp(props) {
  const { Component, pageProps, router } = props;
  const title = "Youni";

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
    // registerServiceWorker()
  });

  return (
    <>
      <Provider store={store}>
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:title" content={title} />
          <link rel="favicon icon" href="/static/favicon.png" />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6596882406101886"
            crossorigin="anonymous"
          ></script>
        </Head>
        <Validateuser />
        <ToastContainer />
        <ProtectedRoutes router={router}>
          <Loading />
          <Component {...pageProps} />
          <Footer />
        </ProtectedRoutes>
      </Provider>
    </>
  );
}
