import React from "react";
import App from "next/app";
import Head from "next/head";
import { AppProvider } from "@shopify/polaris";
import { Provider, Context } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ClientRouter from "../components/ClientRouter";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import {Provider as ProviderRedux} from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { initializeStore } from '../_store/store'

class MyProvider extends React.Component {
  static contextType = Context;

  render() {
    const app = this.context;

    const client = new ApolloClient({
      fetch: authenticatedFetch(app),
      fetchOptions: {
        credentials: "include",
      },
    });

    return (
      <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
    );
  }
}

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    // We can dispatch from here too
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  
    return {pageProps};
  }
  render() {
    const { Component, pageProps, shopOrigin,store } = this.props;

    const config = { apiKey: API_KEY, shopOrigin, forceRedirect: true };
    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
        </Head>
        <ProviderRedux store={store}>
          <Provider config={config}>
            <ClientRouter />
            <AppProvider i18n={translations}>
              <MyProvider>
                <Component {...pageProps} />
              </MyProvider>
            </AppProvider>
          </Provider>
        </ProviderRedux>
      </React.Fragment>
    );
  }
}


MyApp.getInitialProps = async ({ ctx }) => {
  return {
    shopOrigin: ctx.query.shop,
  };
};

export default withRedux(initializeStore)(MyApp)
