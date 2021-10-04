import React, { useContext, useEffect } from "react";
import { Typography, Form, Input, Avatar, Tooltip } from "antd";
import "./style.scss";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import { useHistory } from "react-router";

const { Paragraph } = Typography;

function Message({ text, displayName, createdAt, photoURL, own, id }) {
  const {
    user: { uid },
  } = useContext(AuthContext);
  const { selectedRoomId, setUserInf } = useContext(AppContext);
  const history = useHistory();
  useEffect(() => {
    db.collection("nofications")
      .where("roomId", "==", selectedRoomId.filter((i) => i.length > 0).toString())
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => {
          if (doc.data().uid === uid) {
            db.collection("nofications").doc(doc.id).update({ seen: true });
          }
        });
      });
  }, [selectedRoomId]);
  const hanldeSearch = () => {
    setUserInf({
      displayName: displayName,
      photoURL: photoURL,
      uid: id,
    });
    history.push("/profile", id);
    console.log(id);
  };
  return (
    <div className="messsage__wrap ">
      {!own ? (
        <div>
          <Avatar src={photoURL} onClick={hanldeSearch} style={{cursor:"pointer"}}></Avatar>
        </div>
      ) : (
        ""
      )}
      <div className={`${own ? "messsage__content own" : "messsage__content"}`}>
        <Paragraph className="messsage__content-input" style={{ marginBottom: 0 }}>
          <div className="fit-content">{text.message}</div>
        </Paragraph>
      </div>
    </div>
  );
}

export default Message;
