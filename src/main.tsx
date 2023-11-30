import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import Providers from './Providers.tsx';
import Layout from './Layout.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <Layout>
        <App />
      </Layout>
    </Providers>
  </React.StrictMode>
);
