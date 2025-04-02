import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import Home from './ui/home/Home';
import Login from './ui/login/Login';
import Signup from './ui/signup/Signup';
import Navbar from './ui/navbar/Navbar';
import NoAccount from './ui/noAccount/NoAccount';

function App() {
  const { authIsReady, user } = useAuthContext()
  const [graphMode, setGraphMode] = useState("separated");

  const toggleGraphMode = () => {
    setGraphMode(prev => prev === "separated" ? "combined" : "separated");
  };

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar toggleGraphMode={toggleGraphMode} />
          <Switch>
            <Route exact path="/Holiday_Weather_Advisor">
              {!user && <Redirect to="/Holiday_Weather_Advisor/noAccount" />}
              {user && <Home graphMode={graphMode} />}
            </Route>
            <Route path="/Holiday_Weather_Advisor/login">
              {user && <Redirect to="/Holiday_Weather_Advisor" />}
              {!user && <Login />}
            </Route>
            <Route path="/Holiday_Weather_Advisor/signup">
              {user && <Redirect to="/Holiday_Weather_Advisor" />}
              {!user && <Signup />}
            </Route>
            <Route path="/Holiday_Weather_Advisor/noAccount">
              {user && <Redirect to="/Holiday_Weather_Advisor" />}
              {!user && <NoAccount graphMode={graphMode} />}
            </Route>
            <Route path="*">
              <Redirect to="/Holiday_Weather_Advisor" />
            </Route>
          </Switch>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App