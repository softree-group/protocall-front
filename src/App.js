import './App.css';
import Main from "./components/Main/Main";
import {Switch, Route} from "react-router-dom";
import Conference from "./components/Conference/Conference";
import {UserContext} from "./context/userContext";
import {useEffect, useRef, useState} from "react";
import {Redirect} from "react-router";

function App() {
  const [userData, setUserData] = useState(null);
  const audioRef = useRef(null);
  const setUserDataHandler = (data) => {
      localStorage.setItem("account", JSON.stringify(data));
      setUserData(data);
  }
  const delUserData = () => {
      localStorage.removeItem("account");
      setUserData(null);
  }

  useEffect(() => {
      const item = JSON.parse(localStorage.getItem("account"));
      if (!item) {
          return
      }
      setUserData(item);
  }, []);

  return (
      <UserContext.Provider value={{userData, setUserData: setUserDataHandler, delUserData}}>
          <audio ref={audioRef}/>
          <Switch>
              <Route exact path="/" component={Main}/>
              <Route path="/meet" component={() => <Conference audioRef={audioRef}/>}/>
          </Switch>
      </UserContext.Provider>
  );
}

export default App;
