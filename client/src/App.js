import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import MainNavigation from './components/shared/navigation/MainNavigation';
import Allbooks from './components/books/pages/Allbooks';
import User from './components/users/pages/User';
import UserAuth from './components/users/pages/UserAuth';
import { AuthContext } from './components/shared/context/AuthContext';
import { useAuth } from './components/shared/hooks/useAuth';

import './App.css';

function App() {
  const { user, token, login, logout } = useAuth();
  const options = {
    uri: `${process.env.REACT_APP_API_URL}/graphql`,
    cache: new InMemoryCache(),
    headers: {},
  };
  if (!!token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  const client = new ApolloClient(options);

  const routes = !!token ? (
    <Switch>
      <Route exact path="/">
        <Allbooks />
      </Route>
      <Route path="/users/:uid">
        <User />
      </Route>
      <Redirect to={`/users/${user ? user.id : null}`} />
    </Switch>
  ) : (
    <Switch>
      <Route exact path="/">
        <Allbooks />
      </Route>
      <Route path="/login">
        <UserAuth />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <AuthContext.Provider value={{ user, token, login, logout }}>
          <Router>
            <Helmet>
              <title>BookStore</title>
              <meta
                name="description"
                content="A Book store app demonstrating apollo graphql"
              />
              <meta name="author" content="Tarik Khan" />
            </Helmet>
            <MainNavigation />
            {routes}
          </Router>
        </AuthContext.Provider>
      </ApolloProvider>
    </div>
  );
}

export default App;

// typePolicies: {
// User: {
//   fields: {
//     books(existingBooks, { canRead }) {
//       console.log('saal ', existingBooks);
//       let result = existingBooks ? existingBooks.filter(canRead) : [];
//       console.log('saal result ', result);
//       return result;
//     },
//   },
// },
// Author: {
//   fields: {
//     books(existingBooks, { canRead }) {
//       console.log('maal ', existingBooks);
//       let result = existingBooks ? existingBooks.filter(canRead) : [];
//       console.log('maal result ', result);
//       return result;
//     },
//   },
// },
// },
