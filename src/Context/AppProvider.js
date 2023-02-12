import React, { useContext, useMemo, useState } from "react";
import { useFireStore, useFireStoreToListenNofiMessage } from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [listUserChatted, setListUserChatted] = useState([]);
  const [selectedUserId, setSelectedserId] = useState("");
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMember, setisInviteMember] = useState(false);
  const [isRoomChange, setIsRoomChange] = useState(false);
  const [iconHome, setIconHome] = useState(false);
  const [iconMessage, setIconMessage] = useState(false);
  const [iconProfile, setIconProfile] = useState(false);
  const [isIconNofiDropdown, setIsIconNofiDropdown] = useState(false);
  const [openCardModal, setOpenCardModal] = useState(false);
  const [openAddCardModal, setOpenAddCardModal] = useState(false);
  const [postInf, setPostInf] = useState({});
  const [listCardProfile, setListCardProfile] = useState([]);
  const [userInf, setUserInf] = useState({});
  const [loading, setLoading] = useState(false);
  const [haveHeader, setHaveHeader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [isValidAuth, setIsValidAuth] = useState(false);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false);
  const [isShowModalMode, setIsShowModalMode] = useState("Search" || "Invite");

  const {
    user: { uid },
  } = useContext(AuthContext);

  //Get list room of user current
  const roomsCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFireStore("rooms", roomsCondition);

  // filter room và lấy id người nhắn tin còn lại k phải người đang đăng nhập
  const result = useMemo(() => {
    let kq = rooms.map((item) => {
      return item.members.map((i) => {
        if (i !== uid) {
          return i;
        }
      });
    });
    let room = [];
    kq = kq.map((i) => i.filter((item) => item));
    kq.map((item) => {
      room.push(item[0]);
    });

    return room;
  }, [rooms, uid]);

  // lấy thông tin user từ array id
  const usersCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: result.length === 0 ? [""] : result,
    };
  }, [result]);

  const members = useFireStore("users", usersCondition);

  const selectedRoomId = useMemo(() => {
    let kq = rooms.map((item) => {
      return item.members.map((i) => {
        if (i === selectedUserId) {
          return item.roomId;
        }
      });
    });

    kq = kq.map((i) => i.filter((item) => item));

    return kq;
  }, [rooms, selectedUserId]);

  const roomCondition = useMemo(
    () => ({
      fieldName: "uid",
      operator: "==",
      compareValue: uid,
    }),
    [uid]
  );
  const messageNofi = useFireStoreToListenNofiMessage("nofications", roomCondition);

  const messageNofiIsSeen = useFireStore("nofications", roomCondition);

  const condition = useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoomId.filter((i) => i.length > 0).toString(),
    }),
    [selectedRoomId]
  );

  const messages = useFireStore("messages", condition);

  const membersIsSeen = useMemo(() => {
    let member = [...members];
    member = member.map((i) => {
      return {
        ...i,
        isSeenMessage: true,
      };
    });

    let nofis = [...messageNofiIsSeen];
    for (let index = 0; index < member.length; index++) {
      if (uid === nofis[index]?.uid && !nofis[index].seen) {
        member[index].isSeenMessage = false;
      }
    }
    return member;
    // console.log({nofis});
  }, [members, messageNofiIsSeen, uid]);
  return (
    <AppContext.Provider
      value={{
        messages,
        selectedRoomId,
        selectedUserId,
        setSelectedserId,
        listUserChatted,
        isAddRoomVisible,
        setIsAddRoomVisible,
        isInviteMember,
        setisInviteMember,
        setIsRoomChange,
        members,
        iconHome,
        setIconHome,
        iconMessage,
        setIconMessage,
        openCardModal,
        setOpenCardModal,
        openAddCardModal,
        setOpenAddCardModal,
        postInf,
        setPostInf,
        userInf,
        setUserInf,
        loading,
        setLoading,
        haveHeader,
        setHaveHeader,
        messageNofi,
        isLoading,
        setIsLoading,
        listCardProfile,
        setListCardProfile,
        isMessage,
        setIsMessage,
        isValidAuth,
        setIsValidAuth,
        iconProfile,
        setIconProfile,
        openSettingModal,
        setOpenSettingModal,
        openChangeAvatarModal,
        setOpenChangeAvatarModal,
        membersIsSeen,
        isShowModalMode,
        setIsShowModalMode,
        isIconNofiDropdown,
        setIsIconNofiDropdown,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
