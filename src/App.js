import './App.css';
import Main from "./components/Main/Main";
import {Switch, Route} from "react-router-dom";
import Conference from "./components/Conference/Conference";
import {UserContext} from "./context/context";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {API} from "./backend/api";
import Join from "./components/Join/Join";
import Meet from "./components/Meet/Meet";
import {toast, Toaster} from "react-hot-toast";

function App() {
  const [userData, setUserData] = useState(null);
  const audioRef = useRef(null);
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
              delUserData();
          })
  }, []);

  useEffect(() => {
      if (!window.chrome) {
          toast.error("Настоятельно рекомендуем использовать Google Chrome. В случае продолжения использования данного браузера возможны непредвиденные ошибки", {duration: 6000})
      }
  }, [])

  return (
      <UserContext.Provider value={{userData, setUserData, delUserData}}>
          <Toaster/>
          <audio ref={audioRef}/>
          <Switch>
              <Route exact path="/" component={Main}/>
              <Route path="/join/:meetID" component={Join}/>
              <Route path="/meet" component={() => <Conference audioRef={audioRef}/>}/>
          </Switch>
      </UserContext.Provider>
  );
}

export default App;
