import { useState } from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink,} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import MapContainer from "./components/MapContainer";
import SplashScreen from "./components/SplashScreen";

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem('id_token');
  // if (Auth.loggedIn()){
  //   return {
  //     headers: {
  //       ...headers,
  //       authorization: token ? `Bearer ${token}` : '',
  //     },
  //   };
  // }
});

const httpLink = createHttpLink({uri: '/graphql'});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  // console.log('App');
  const [consent, setConsent] = useState(false);

  return (
    <ApolloProvider client={client}>
      {consent === true
        ? <MapContainer /> 
        : <SplashScreen setConsent={setConsent} />
      }
    </ApolloProvider>
  );
}

export default App;
