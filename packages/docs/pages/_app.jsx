import '../styles/globals.css';
import 'nextra-theme-docs/style.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      router.push('/en');
    }
  }, [router, router.pathname]);

  return <Component {...pageProps} />;
}
