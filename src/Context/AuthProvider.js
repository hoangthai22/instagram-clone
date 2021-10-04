import { InstagramOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { auth, db } from "../firebase/config";
import { Loading } from "./../components/Loading/loading";
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((userLogin) => {
      try {
        if (userLogin) {
          db.collection("users")
            .where("uid", "==", userLogin.uid)
            .get()
            .then((snapshot) => {
              return snapshot.docs.map((doc) => {
                setUser({ ...doc.data(), id: doc.id });
                db.collection("users").doc(doc.id).update({ isOnline: true });

                return doc.data();
              });
            })
            .then(() => {
              if (history.location.pathname === "/profile") {
                history.push("/profile");
              } else if (history.location.pathname === "/chat") {
                history.push("/chat");
              } else if (history.location.pathname === "/edit") {
                history.push("/edit");
              } else {
                history.push("/");
              }
            });
        } else {
          history.push("/login");
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    });
    //clean function

    return () => {
      unsubscribed();
    };
  }, [history]);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {/* {isLoading ? <Loading/> : children} */}

      {isLoading ? (
        <div className="loading__page">
          <div className="loading__page__icon">
            <InstagramOutlined className="loading__page__img" />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
