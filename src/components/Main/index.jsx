import firebase from "firebase";
import React, { useContext, useEffect } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../../Context/AppProvider";
import Messenger from "../../features/Messenger";
import Profile from "../../features/Profile";
import EditProfile from "../../features/Profile/EditProfile";
import ContentComponent from "../Content";
import HeaderComponent from "../Header";
import NoficationMobile from "../Nofication/NoficationMobile";

function Main() {
  const history = useHistory();
  const { haveHeader, setHaveHeader } = useContext(AppContext);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        history.push("/login");
        return;
      }
      setHaveHeader(true);
    });
    return () => unregisterAuthObserver();
  }, []);

  const match = useRouteMatch();
  return (
    <div>
      {haveHeader ? <HeaderComponent /> : ""}
      <Switch>
        <Route exact path={`${match.url}`} component={ContentComponent} />
        <Route path={`${match.url}chat`} component={Messenger} />
        <Route path={`${match.url}edit`} component={EditProfile} />
        <Route path={`${match.url}profile`} component={Profile} />
        <Route path={`${match.url}nofication`} component={NoficationMobile} />
        {/* <Route component={NotFound} /> */}
      </Switch>
    </div>
  );
}

export default Main;
