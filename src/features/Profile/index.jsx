import { SettingOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Dropdown, Row, Typography, Menu } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { SkeletonCustom } from "../../components/Skeleton/Skeleton";
import { handleCancelFollow, handleFollow } from "../../constants/handleFollow";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../firebase/config";
import { addDocument, stringToHash } from "../../firebase/services";
import { useFireStore } from "../../hooks/useFirestore";
import "./style.scss";

const { Text, Paragraph } = Typography;

const Profile = () => {
  const { setOpenCardModal, setSelectedserId, setOpenAddCardModal, setPostInf, userInf, setListCardProfile, setIconHome, setIconMessage, setIconProfile, openSettingModal, setOpenSettingModal } =
    useContext(AppContext);
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [userInfomation, setUserInfomation] = useState({});
  const [isFollow, setIsFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listPost, setListPost] = useState([]);
  // Check if click on Profile and click on Search user
  useEffect(() => {
    if (user?.uid) {
      const { uid } = user;
      if (history.location.state === uid || typeof history.location.state === "undefined") {
        setUserInfomation({ uid });
      } else if (history.location.state !== uid && userInf.uid) {
        setUserInfomation({ uid: userInf.uid });
      } else {
        setUserInfomation({ uid });
      }
      setIsLoading(true);
      db.collection("post")
        .where("uid", "==", history.location.state ? history.location.state : uid)
        .orderBy("createdAt")
        .get()
        .then((snapshot) => {
          setListPost(snapshot.docs.map((doc) => ({ ...doc.data() })));
        })
        .then(() => {
          setIsLoading(false);
        });
    }
  }, [history.location.state, userInf, user]);

  // Change when userInfomation change when redirect to profile page
  const usersCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: userInfomation.uid,
    };
  }, [userInfomation.uid]);

  const users = useFireStore("users", usersCondition);

  // Set condition for postCondition
  const postsCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: userInfomation.uid,
    };
  }, [userInfomation.uid]);

  // Call function to get data from firestores
  const posts = useFireStore("post", postsCondition);
  useEffect(() => {
    setIconProfile(true);
    setIconMessage(false);
    setIconHome(false);
  }, [posts]);

  // Set follow button
  useEffect(() => {
    if (users[0]?.listFollower?.some((item) => item.uid === user?.uid)) {
      setIsFollow(true);
    } else {
      setIsFollow(false);
    }
  }, [users, user?.uid]);
  // Toggle Modal
  const handleToggleModal = (userInf, imgPost, postId, content, index, uid) => {
    const postInf = {
      ...userInf,
      imgPost: imgPost,
      postId: postId,
      content: content,
      index: index,
      uid: uid,
    };
    setListCardProfile(posts);
    setPostInf(postInf);
    setOpenCardModal(true);
  };

  // Hanlde when user click on button "nhawn tin"
  const handleChatting = async () => {
    const { uid } = user;
    const result = await db
      .collection("rooms")
      .where("members", "array-contains", uid)
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => {
          if (doc.data()?.members.includes(uid) && doc.data()?.members.includes(users[0]?.uid)) {
            return doc.data();
          } else return null;
        });
      });
    if (result[0] === null || result.length === 0) {
      addDocument("rooms", {
        roomId: stringToHash(uid + users[0]?.uid + new Date().toString()).toString(),
        members: [uid, users[0]?.uid],
      });
      addDocument("nofications", {
        uid: uid,
        seen: true,
        roomId: stringToHash(uid + users[0]?.uid + new Date().toString()).toString(),
      });
      addDocument("nofications", {
        uid: users[0]?.uid,
        seen: false,
        roomId: stringToHash(uid + users[0]?.uid + new Date().toString()).toString(),
      });
      setSelectedserId(users[0]?.uid);
    }

    history.push("/chat");
  };

  return (
    <Content className="content__profile">
      <Row>
        <Col
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 24, offset: 0 }}
          md={{ span: 24, offset: 0 }}
          lg={{ span: 20, offset: 2 }}
          xl={{ span: 16, offset: 4 }}
          xxl={{ span: 12, offset: 6 }}
          className="profile__header"
          style={{ marginTop: 90 }}
        >
          {/* <div className="profile__container"> */}
          <div className="profile__header__wrap">
            <div className="profile__header__avatar">
              <Avatar className="profile__header__avatar__img" src={users[0]?.photoURL} />
            </div>

            <div className="profile__header__info">
              <div className="profile__header__info__username">
                <div className="profile__header">
                  <Text style={{ fontSize: "1.5rem" }}>{users[0]?.displayName}</Text>
                </div>
                {/* ---------------------- */}
                <div className="profile__header__info__username__child">
                  {users[0]?.uid === user?.uid ? (
                    <Button onClick={() => setOpenAddCardModal(true)} style={{ marginLeft: 20 }} className="profile__header__info__username-btn">
                      Thêm bài viết
                    </Button>
                  ) : (
                    ""
                  )}
                  {users[0]?.uid !== user?.uid ? (
                    <div>
                      {!isFollow ? (
                        <Button
                          onClick={() => {
                            handleFollow(users[0], user);
                            setIsFollow(true);
                          }}
                          style={{
                            marginLeft: 20,
                            backgroundColor: "#0095f6",
                            borderRadius: 3,
                            width: 100,
                          }}
                        >
                          <Text style={{ color: "#fff", fontWeight: "bold" }}>Theo dõi</Text>
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handleChatting}
                            style={{
                              marginLeft: 20,
                              borderRadius: 3,
                              width: 90,
                            }}
                            className="mobi-profile__header__info__username__child__btn"
                          >
                            <Text style={{ fontWeight: 500 }}>Nhắn tin</Text>
                          </Button>
                          <Button
                            onClick={() => {
                              handleCancelFollow(users[0], user);
                              setIsFollow(false);
                            }}
                            style={{
                              marginLeft: 20,
                              borderRadius: 3,
                              width: 70,
                            }}
                          >
                            <UserDeleteOutlined style={{ fontSize: "1.2rem" }} />
                          </Button>
                        </>
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  {/* ---------------------- */}

                  <SettingOutlined
                    style={{
                      marginLeft: 20,
                      fontSize: 23,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setOpenSettingModal(true);
                    }}
                  />
                </div>
              </div>
              <div className="profile__header__info__follow">
                <Text style={{ fontSize: "1rem" }}>
                  <Text style={{ fontWeight: 500 }}>{posts.length}</Text>
                  <Text> posts</Text>
                </Text>
                <Text style={{ fontSize: "1rem" }}>
                  <Text
                    style={{
                      fontWeight: 500,
                      marginLeft: 40,
                      marginRight: 5,
                    }}
                  >
                    {users[0]?.listFollower ? users[0].listFollower.length : "0"}
                  </Text>
                  followers
                </Text>
                <Text style={{ fontSize: "1rem" }}>
                  <Text
                    style={{
                      fontWeight: 500,
                      marginLeft: 40,
                      marginRight: 5,
                    }}
                  >
                    {users[0]?.listFollow ? users[0].listFollow.length : "0"}
                  </Text>
                  following
                </Text>
              </div>
              <div className="profile__header__info__description">
                <Text style={{ fontSize: "1rem", fontWeight: 500 }}>Hoang Thai</Text>
                <br />
                <Paragraph className="paragraph" ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}>
                  {users[0]?.description}
                </Paragraph>
              </div>
            </div>
          </div>
          <div className="mobi-profile__header__info__description">
            <Text style={{ fontSize: "1rem", fontWeight: 500 }}>Hoang Thai</Text>
            <br />
            <Paragraph className="paragraph" ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}>
              {user.description}
            </Paragraph>
          </div>
          <div className="mobi-profile__header__info__follow">
            <Text
              style={{
                fontSize: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: 500 }}>{posts.length}</Text>
              <Text style={{ color: "rgb(150,150,150)", fontWeight: 400 }}>posts</Text>
            </Text>
            <Text
              style={{
                fontSize: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: 500 }}>{users[0]?.listFollower ? users[0].listFollower.length : "0"}</Text>
              <Text style={{ color: "rgb(150,150,150)", fontWeight: 400 }}>followers</Text>
            </Text>
            <Text
              style={{
                fontSize: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: 500 }}>{users[0]?.listFollow ? users[0].listFollow.length : "0"}</Text>
              <Text style={{ color: "rgb(150,150,150)", fontWeight: 400 }}>following</Text>
            </Text>
          </div>
          <div className="profile__menu">
            <div className="profile__menu__list">
              <span className="profile__menu__item">POST</span>
              <span className="profile__menu__item">REELS</span>
              <span className="profile__menu__item">IGTV</span>
              <span className="profile__menu__item">SAVED</span>
            </div>
          </div>
          <div className="profile__card__wrap">
            <div className="profile__card__list">
              {isLoading
                ? [1, 2, 3, 4, 5, 6].map((i) => {
                    return <SkeletonCustom key={i} />;
                  })
                : listPost?.map((post, index) => (
                    <div
                      key={post.postId}
                      className="profile__card__item"
                      onClick={() => handleToggleModal(post.userInf, post.imgPost, post.postId, post.content, index, userInfomation.uid, post.postId)}
                    >
                      <img className="profile__card__item__img" src={post.imgPost} alt="" />
                      <div className="hover"></div>
                    </div>
                  ))}
            </div>
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default Profile;
