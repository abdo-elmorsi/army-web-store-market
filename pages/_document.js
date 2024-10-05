import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Save the original renderPage method
    const originalRenderPage = ctx.renderPage;

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole React tree
        enhanceApp: (App) => App,
        // Useful for wrapping on a per-page basis
        enhanceComponent: (Component) => Component,
      });

    // Get initial props from the parent Document
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html lang="ar" className="light">
        <Head>
          {/* Favicon for the site */}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />

          {/* Link to Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
