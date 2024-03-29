import { Avatar, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import "./style.scss";
const { Text } = Typography;

function ListUser() {
  const { user } = useContext(AuthContext);
  const { selectedUserId, setSelectedserId, isMessage, members, selectedRoomId, setIsMessage, membersIsSeen } = useContext(AppContext);

  const hanldeSelectRoom = async (id) => {
    setSelectedserId(id);
    setIsMessage(true);
  };
  useEffect(() => {
    if (user?.uid) {
      db.collection("nofications")
        .where("uid", "==", user.uid)
        .get()
        .then((snapshot) => {
          return snapshot.docs.map((doc) => {
            if (doc.data().roomId === selectedRoomId?.filter((i) => i.length > 0).toString() && doc.data().seen === false) {
              console.log(doc.data());
            }
          });
        });
    }
  }, [selectedRoomId, user.uid]);
  return (
    <div className="sidebar__header__listUser-wraps">
      {membersIsSeen.map((user) => (
        <div key={user.uid} className={user.uid === selectedUserId ? "sidebar__header__listUser active" : "sidebar__header__listUser"} onClick={() => hanldeSelectRoom(user.uid)}>
          <Text key={user.uid} className="sidebar__header__listUser-text" style={{ fontSize: ".9rem" }}>
            <Avatar src={user.photoURL} alt="" size="large" style={{ width: 50, height: 50, marginRight: 15 }} />
            <div className="sidebar__header__listUser__userInfo ">
              <Text className={`sidebar__header__listUser__userInfo__displayName ${user.isSeenMessage ? "isSeen" : ""}`}>{user.displayName}</Text>
              {!user.isSeenMessage ? (
                <Text style={{ fontWeight: "500" }}>Đã gửi tin nhắn cho bạn</Text>
              ) : (
                <Text
                  style={{
                    color: "rgb(150, 150, 150)",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <div className={user.isOnline ? "isOnline" : ""}></div>
                  {user.isOnline ? "Online" : "Offline"}
                </Text>
              )}
            </div>
          </Text>
        </div>
      ))}
    </div>
  );
}

export default ListUser;
