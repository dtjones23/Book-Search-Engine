import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'; // Import ApolloClient and InMemoryCache
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Create Apollo client instance
const client = new ApolloClient({
  uri: 'your-graphql-endpoint', // Update with your GraphQL endpoint
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;