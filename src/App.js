import './App.css';
import Main from "./components/Main/Main";
import {Switch, Route} from "react-router-dom";
import Conference from "./components/Conference/Conference";
import {UserContext} from "./context/userContext";
import {useEffect, useRef, useState} from "react";
import {Redirect} from "react-router";
import axios from "axios";
import {API} from "./backend/api";

function App() {
  const [userData, setUserData] = useState(null);
  const audioRef = useRef(null);
  const setUserDataHandler = (data) => {
      setUserData(data);
  }
  const delUserData = () => {
      setUserData(null);
  }

  useEffect(() => {
      axios.get(API.session)
          .then(response => {
              if (response.status === 200) {
                  setUserData(response.data);
                  return;
              }
              setUserData(null);
          })
          .catch(err => {
              console.error(err);
              setUserData(null);
          })
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
