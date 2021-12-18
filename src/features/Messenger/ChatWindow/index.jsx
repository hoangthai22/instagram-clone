import { InfoCircleOutlined, LeftOutlined, MailOutlined, SmileOutlined } from "@ant-design/icons";
import { Avatar, Col, Typography } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import { addDocument } from "../../../firebase/services";
import Message from "../Message";
import "./style.scss";
const { Text } = Typography;

const ChatWindow = (props) => {
  const {
    user: { uid, photoURL, displayName },
    user,
  } = useContext(AuthContext);
  const { selectedRoomId, selectedUserId, messages, isMessage, setIsMessage } = useContext(AppContext);
  const [noSelectUser, setNoSelectUser] = useState(false);
  const initialValues = { message: "" };

  const validationSchema = Yup.object().shape({
    message: Yup.string().required("This field is required.").min(1),
  });

  useEffect(() => {
    if (!selectedUserId) {
      setNoSelectUser(true);
    } else {
      setNoSelectUser(false);
    }
  }, [selectedUserId]);

  const handleOnSubmit = (values, { resetForm, isValid }) => {
    return new Promise((resolve) => {
      addDocument("messages", {
        text: values,
        uid,
        photoURL,
        roomId: selectedRoomId.filter((i) => i.length > 0).toString(),
        displayName,
      });

      const reuslt = db
        .collection("nofications")
        .where("roomId", "==", selectedRoomId.filter((i) => i.length > 0).toString())
        .get()
        .then((snapshot) => {
          return snapshot.docs.map((doc) => {
            if (doc.data().uid !== uid) {
              db.collection("nofications").doc(doc.id).update({ seen: false });
            }
          });
        });

      console.log({ reuslt });
      resetForm({});
      resolve(true);
    });
  };

  useEffect(() => {
    let objDiv = document.getElementById("scollID");
    objDiv.scrollTop = objDiv.scrollHeight;
  });
  const hanldeBackSideBar = () => {
    setIsMessage(false);
  };
  return (
    <Col className={isMessage ? "chatwindow__header active-message" : "chatwindow__header inactive-message"}>
      <div className="chatwindow__header__wrap">
        <div className="chatwindow__header__title">
          <LeftOutlined style={{ marginRight: 10, fontSize: "1.5rem", cursor: "pointer" }} className="leftArrow" onClick={hanldeBackSideBar} />
          <Text strong className="chatwindow__header__title-text" style={{ fontSize: "1rem", flex: 1 }}>
            <Avatar className="chatwindow__header__title-avatar" src={user.photoURL}></Avatar>
            {user.displayName}
          </Text>
          <InfoCircleOutlined style={{ fontSize: 26 }} />
        </div>

        <div className={noSelectUser ? "chatwindow__body__empty" : "chatwindow__body"}>
          {noSelectUser ? (
            <div id="scollID" className="chatwindow__content__empty">
              <MailOutlined style={{ fontSize: 90, fontWeight: 300 }} />
              <h1>Your Messages</h1>
              <span className="chatwindow__content__empty__text">Please select the user who wants to chat</span>
            </div>
          ) : (
            <>
              <div id="scollID" className="chatwindow__content__chat">
                {messages.map((mes) => (
                  <Message key={mes.id} id={mes.uid} text={mes.text} photoURL={mes.photoURL} displayName={mes.displayName} createdAt={mes.createdAt} own={mes.uid === uid ? true : false} />
                ))}
              </div>
              <div className="chatwindow__content__input">
                <Formik style={{ marginTop: 8 }} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleOnSubmit}>
                  {(formikProps) => {
                    const { isSubmitting } = formikProps;
                    return (
                      <Form className="chatwindow__content__formik">
                        <div className="chatwindow__content__input-btn">
                          <SmileOutlined
                            style={{
                              fontSize: 25,
                              marginLeft: 10,
                              marginTop: 2,
                            }}
                          />
                          <Field autoComplete="off" onPressEnter={handleOnSubmit} type="text" name="message" className="chatwindow__content__formik__input" placeholder="Nhắn tin..." />
                          <button
                            style={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "#0095f6",
                              marginLeft: 10,
                              cursor: "pointer",
                              border: "none",
                              backgroundColor: "#fff",
                            }}
                            type="submit"
                            disabled={isSubmitting}
                          >
                            Gửi
                          </button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </>
          )}
        </div>
      </div>
    </Col>
  );
};

export default ChatWindow;
