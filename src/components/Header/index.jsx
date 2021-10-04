import { FlagOutlined, HomeFilled, HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Dropdown, Form, Layout, Menu, Row, Select, Spin, Typography } from "antd";
import { debounce } from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { auth, db } from "../../firebase/config";
import { fetchUserList, useFireStore } from "../../hooks/useFirestore";
import "./style.scss";
const { Header } = Layout;
const { Text } = Typography;

const HeaderComponent = () => {
  const { user, setUser } = useContext(AuthContext);
  const { iconHome, iconMessage, selectedRoomId, setUserInf, setHaveHeader, messageNofi, setIconHome, setIconMessage, iconProfile, setIconProfile } = useContext(AppContext);
  const [value, setValue] = useState([]);
  const [isNofi, setIsNofi] = useState([]);
  const [isNofiAfterMerge, setIsNofiAfterMerge] = useState([]);
  const [isFollow, setIsFollow] = useState(false);
  const [isNofiIcon, setIsNofiIcon] = useState(false);
  const [iconNofi, setIsIconNofi] = useState(false);
  const [pageCurrent, setPageCurrent] = useState("");
  const [form] = Form.useForm();

  const {
    user: { uid },
  } = useContext(AuthContext);

  const history = useHistory();

  // Logout and set isOnline = false
  const hanldeSignOut = async () => {
    setHaveHeader(false);
    await auth.signOut();
    history.push("/login");

    db.collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => {
          db.collection("users").doc(doc.id).update({ isOnline: false });
          setUser({});
        });
      });
  };

  const noficationCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: uid,
    };
  }, [uid]);

  // Call function to get data from firestores
  const nofications = useFireStore("users", noficationCondition);

  // const userNofiCondition = useMemo(() => {
  //   return {
  //     fieldName: "uid",
  //     operator: "in",
  //     compareValue: nofications[0]?.listFollower,
  //   };
  // }, [nofications]);

  // const userNofi = useFireStore("users", userNofiCondition);

  const likeNofiCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: uid,
    };
  }, [uid]);

  const likeNofi = useFireStore("post", likeNofiCondition);

  useEffect(() => {
    if (!nofications[0]?.nofication) {
      setIsNofiIcon(true);
    }
    // setTimeout(() => {
    //   setIsNofiIcon(false);
    // }, 5000);
    const list = messageNofi.filter((item) => item);
    setIsNofi(list);
  }, [messageNofi, selectedRoomId, nofications]);

  useEffect(() => {
    if (nofications[0]?.listFollower?.some((item) => item.uid === uid)) {
      setIsFollow(true);
    } else {
      setIsFollow(false);
    }
  }, [uid, nofications]);

  useEffect(() => {
    if (nofications[0]?.listFollower) {
      let newList = likeNofi.filter((i) => i.userLiked?.length > 0);
      let arrayMerge = [...nofications[0]?.listFollower, ...newList];
      arrayMerge = arrayMerge.sort((a, b) => {
        var c = null;
        var d = null;
        if (a.userLiked) {
          c = new Date(a.userLiked[a.userLiked?.length === 0 ? 0 : a.userLiked?.length - 1]?.createdAtLike.seconds);
        } else {
          c = new Date(a.createdAtFollow.seconds);
        }
        if (b.userLiked) {
          d = new Date(b.userLiked[b.userLiked?.length === 0 ? 0 : b.userLiked?.length - 1]?.createdAtLike.seconds);
        } else {
          d = new Date(b.createdAtFollow.seconds);
        }
        return c - d;
      });
      setIsNofiAfterMerge(arrayMerge);
    }
    // console.log({ isNofiAfterMerge });
  }, [likeNofi, nofications]);
  // List menu
  const menu = (
    <Menu
      style={{
        width: 280,
        height: 200,
        borderRadius: 10,
        left: 30,
        padding: 8,
      }}
    >
      <Menu.Item
        key="1"
        onClick={() => {
          history.push("/profile", uid);
        }}
      >
        <div className="dropdown__wrap">
          <UserOutlined style={{ fontSize: 20 }} />
          <span className="dropdown__text"> Trang cá nhân</span>
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div className="dropdown__wrap">
          <FlagOutlined style={{ fontSize: 20 }} />
          <span className="dropdown__text"> Đã lưu</span>
        </div>
      </Menu.Item>
      <Menu.Item key="3">
        <div className="dropdown__wrap">
          <SettingOutlined style={{ fontSize: 20 }} />
          <span className="dropdown__text"> Cài đặt</span>
        </div>
      </Menu.Item>
      <hr className="hr" />
      <Menu.Item onClick={hanldeSignOut} key="4">
        <div className="dropdown__wrap-last">
          <span className="dropdown__text-last"> Đăng xuất</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const nofication = (
    <Menu
      style={{
        width: 500,
        height: 349,
        borderRadius: 10,
        left: 30,
        padding: 8,
        overflowY: "scroll",

        boxShadow: "0 0 5px 1px rgb(0 0 0 / 20%)",
      }}
      className="nofication__mobile"
    >
      <div className="test__test">
        {isNofiAfterMerge.map((item) => {
          if (item.createdAtFollow) {
            return (
              <Menu.Item key={item.createdAtFollow} style={{ flexShrink: 0, height: 68, padding: 0 }}>
                <div style={{ display: "flex" }} className="nofi__wrap__mobile">
                  <Avatar src={item.photoURL} style={{ width: 40, height: 40, marginRight: 10, flexShrink:0 }}></Avatar>
                  <Text style={{ flex: 1 }} className="nofi__text__mobile">
                    {item?.displayName} đã bắt đầu theo dõi bạn
                    <span></span>
                  </Text>
                  {/* {isFollow ? (
                  <Button
                    onClick={() => {
                      handleCancelFollow(item, user);
                      setIsFollow(false);
                    }}
                    style={{ marginLeft: 20, borderRadius: 3, width: 120 }}
                  >
                    <Text style={{ fontWeight: 500 }}>Đang theo dõi </Text>
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      handleFollow(item, user);
                      setIsFollow(true);
                    }}
                    style={{
                      marginLeft: 20,
                      backgroundColor: "#0095f6",
                      borderRadius: 3,
                      width: 100,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Theo dõi
                    </Text>
                  </Button>
                )} */}
                </div>
              </Menu.Item>
            );
          } else {
            return (
              <>
                {item.userLiked.length > 0 && item?.userLiked[0].uid !== uid ? (
                  <Menu.Item key={item.createdAtFollow} style={{ flexShrink: 0, height: 68, padding: 0 }}>
                    <div style={{ display: "flex", alignItems: "center" }} className="nofi__wrap__mobile">
                      {item?.userLiked.length > 1 ? (
                        <Avatar
                          src={
                            !item.userLiked.some((item) => item.uid === uid) || item?.userLiked[item?.userLiked.length - 1].uid !== uid
                              ? item?.userLiked[item?.userLiked.length - 1].photoURL
                              : item?.userLiked[item?.userLiked.length - 2].photoURL
                          }
                          style={{ width: 40, height: 40, marginRight: 10, flexShrink:0 }}
                          className="nofi__avatar__mobile"
                        ></Avatar>
                      ) : item?.userLiked[0].uid === uid ? (
                        ""
                      ) : (
                        <Avatar src={item?.userLiked[0].photoURL} style={{ width: 40, height: 40, marginRight: 10, flexShrink:0 }}></Avatar>
                      )}

                      {item?.userLiked.length > 1 ? (
                        <Text style={{ flex: 1 }} className="nofi__text__mobile">
                          {!item.userLiked.some((item) => item.uid === uid) || item?.userLiked[item?.userLiked.length - 1].uid !== uid
                            ? item?.userLiked[item?.userLiked.length - 1].displayName + " "
                            : item?.userLiked[item?.userLiked.length - 2].displayName + " "}
                          và {item?.userLiked.length - 1} người khác đã thích bài viết của bạn
                        </Text>
                      ) : item?.userLiked[0].uid === uid ? (
                        ""
                      ) : (
                        <Text style={{ flex: 1 }} className="nofi__text__mobile">
                          {item?.userLiked[0].displayName} đã thích bài viết của bạn
                        </Text>
                      )}
                      {item?.userLiked[0].uid === uid ? (
                        ""
                      ) : (
                        <img
                          src={item.imgPost}
                          alt="image__post"
                          style={{
                            width: "10%",
                            height: "10%",
                            alignSelf: "flex-end",
                          }}
                          className="imgPost__mobile"
                        />
                      )}
                    </div>
                  </Menu.Item>
                ) : (
                  ""
                )}
              </>
            );
          }
        })}
      </div>
    </Menu>
  );

  const hanldeUpdateNofi = () => {
    setIsIconNofi(true);
    db.collection("users")
      .where("uid", "==", uid)
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((doc) => {
          db.collection("users").doc(doc.id).update({ nofication: true });
        });
      });
  };

  function DebountSelect({ fetchOptions, debounceTimeout = 200, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [option, setOption] = useState([]);

    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        setOption([]);
        setFetching(true);

        // console.log("option", option);
        fetchOptions(value, props.curmembers).then((newOptions) => {
          setOption(newOptions);
          setFetching(false);
        });
      };
      return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions]);
    // console.log("New option", option);

    return (
      <Select labelInValue filterOption={false} onSearch={debounceFetcher} notFoundContent={fetching ? <Spin size="small" style={{}} /> : ""} {...props}>
        {option.map((opt) => (
          <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size="small" src={opt.photoURL} style={{ marginRight: 10 }}>
              {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {`${opt.label}`}
          </Select.Option>
        ))}
      </Select>
    );
  }

  // Submit search user and go to Profile page
  const handleSearch = (newValue) => {
    setUserInf({
      displayName: newValue[0].label[1],
      photoURL: newValue[0].label[0].props.src,
      uid: newValue[0].value,
    });
    history.push("/profile", newValue[0].value);
    // console.log(newValue[0].label[1]);

    setValue([]);
  };
  const handleIconNofi = () => {
    setIsIconNofi(!iconNofi);
    if (iconHome) {
      setPageCurrent("home");
    } else if (iconMessage) {
      setPageCurrent("chat");
    } else if (iconProfile) {
      setPageCurrent("profile");
    }

    if (!iconNofi) {
      setIconHome(false);
      setIconMessage(false);
    } else {
      if (pageCurrent === "home") {
        setIconHome(true);
      } else if (pageCurrent === "chat") {
        setIconMessage(true);
      } else if (pageCurrent === "profile") {
        setIconProfile(true);
      }
    }
    // iconHome
    // iconMessage
  };
  return (
    <div className="header-wrap">
      <Header className="header">
        <Row>
          <Col
            flex
            className="header__container"
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 20, offset: 2 }}
            xl={{ span: 16, offset: 4 }}
            xxl={{ span: 12, offset: 6 }}
          >
            <div className="header__Logo-img">
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" className="header__img" />
            </div>
            <div style={{ alignSelf: "center" }}>
              <Form form={form} layout="vertical">
                <DebountSelect
                  className="header__input"
                  mode="multiple"
                  label="Member name"
                  placeholder="Nhập tên..."
                  fetchOptions={fetchUserList}
                  onChange={(newValue) => handleSearch(newValue)}
                  style={{ width: 200 }}
                  curmembers={uid ? uid : ""}
                />
              </Form>
            </div>

            <div className="header__btns">
              {iconHome ? (
                <HomeFilled
                  style={{ fontSize: 25, marginLeft: 22 }}
                  onClick={() => {
                    history.push("/");
                  }}
                />
              ) : (
                <HomeOutlined
                  style={{ fontSize: 25, marginLeft: 22 }}
                  onClick={() => {
                    history.push("/");
                  }}
                />
              )}

              <Link to="/chat">
                <div className="header__btns-icon-message-wrap">
                  <img
                    src={iconMessage ? "https://img.icons8.com/ios-filled/25/000000/facebook-messenger.png" : "https://img.icons8.com/ios/25/000000/facebook-messenger--v1.png"}
                    alt="message"
                    className="header__btns-icon-message"
                  />
                  {isNofi.length > 0 ? (
                    <>
                      <div className="header__btns-icon-countMessage"></div>
                      <span className="header__btns-icon-count">{isNofi.length}</span>{" "}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </Link>
              <Dropdown overlay={nofication} placement="bottomRight" trigger={["click"]} arrow visible={iconNofi} onVisibleChange={handleIconNofi}>
                <div
                  className="header__btns"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: 55,
                    alignItems: "flex-end",
                    position: "relative",
                  }}
                >
                  {iconNofi ? (
                    <img
                      onClick={hanldeUpdateNofi}
                      src="/heart.png"
                      alt=""
                      style={{
                        width: 25,
                        height: 25,
                        marginLeft: 22,
                        cursor: "pointer",
                        marginTop: 15,
                      }}
                    />
                  ) : (
                    <img
                      onClick={hanldeUpdateNofi}
                      src="/heart-black.png"
                      alt=""
                      style={{
                        width: 25,
                        height: 25,
                        marginLeft: 22,
                        cursor: "pointer",
                        marginTop: 15,
                      }}
                    />
                  )}

                  {!nofications[0]?.nofication ? (
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        backgroundColor: "#ed4956",
                        borderRadius: "50%",
                        position: "absolute",
                        bottom: 3,
                        right: 10,
                      }}
                    ></div>
                  ) : (
                    ""
                  )}
                  <div
                    style={{
                      borderRadius: 10,
                      bottom: -40,
                      right: -13,
                      backgroundColor: "#ed4956",
                      position: "absolute",
                    }}
                  >
                    {isNofiIcon && !nofications[0]?.nofication ? (
                      <div style={{ height: 35, width: 52, padding: 0 }} className="dropdonw__heart">
                        <div id="heart">
                          <div className="heart__number">1</div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </Dropdown>

              <div className={`header__btns-icon-avatar__wrap${iconProfile ? "-active" : ""}`}>
                <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]} arrow>
                  {user?.photoURL ? <img src={user.photoURL} alt="" className="header__btns-icon-avatar" /> : <Avatar className="header__btns-icon-avatar" />}
                </Dropdown>
              </div>
            </div>
          </Col>
        </Row>
      </Header>
    </div>
  );
};

export default HeaderComponent;
