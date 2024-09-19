import React, { useCallback, useEffect } from 'react';
import PropTypes from "prop-types"
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import NextNprogress from "nextjs-progressbar";

import store from "../store";
import { Provider } from "react-redux";

import { SessionProvider } from 'next-auth/react';

import Layout from "components/layout/Layout";

import "react-datepicker/dist/react-datepicker.css";

import "styles/globals.scss";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import debounce from 'utils/debounce';
import GlobalSetting from "helper/settings/GlobalSetting";
import { CopyRights, ScrollToTopButton } from 'components/UI';
import Head from 'next/head';
import { NextScript } from 'next/document';
import { useRouter } from 'next/router';

const FONT_SIZE_BASE = 16;
const FONT_SIZE_RATIO = 0.1122 / 3;

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const handleResize = useCallback(debounce(() => {
    const fontSize =
      window.innerWidth < 425
        ? `${(window.innerWidth * FONT_SIZE_RATIO).toFixed(1)}px`
        : `${FONT_SIZE_BASE}px`;
    document.documentElement.style.fontSize = fontSize;
  }, 100), []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize]);


  useEffect(() => {
    if (router.locale === "ar") {
      document.documentElement.lang = "ar";
      document.body.dir = "rtl";
    } else {
      document.documentElement.lang = "en";
      document.body.dir = "ltr";
    }
  }, [router.locale]);

  const getLayout =
    Component.getLayout || ((page) => <Layout>{page}</Layout>);
  return (
    <SessionProvider
      session={pageProps.session} >
      <Provider store={store}>
        <Head>
          <title>Easier</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#336a86" />
         

        </Head>
        <NextNprogress
          color="#336a86"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
          showSpinner={false}

        />

        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{
            zIndex: 99999
          }}
        />

        <GlobalSetting>
          {getLayout(<Component {...pageProps} />)}
        </GlobalSetting>

        {/* ScrollToTopButton */}
        <ScrollToTopButton />

        <CopyRights />
      </Provider>
    </SessionProvider>
  );
}
MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired
}


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default appWithTranslation(MyApp);
