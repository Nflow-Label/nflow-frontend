import Head from "next/head";
import Navbar from "../Navbar";
import Footer from "../Footer";
const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Nflow</title>
        <meta name="description" content="Nflow" />
        <link rel="icon" href="/vercel.svg" />
      </Head>
      <main>
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default Layout;
