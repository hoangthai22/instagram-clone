import {
  HeartOutlined,
  LeftOutlined,
  LoadingOutlined,
  MessageOutlined,
  RightOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Form, Input, Modal, Spin, Typography } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { formatDate } from "../../../constants/formatDate";
import {
  handleLikeCard,
  handleUnLikeCard,
} from "../../../constants/handleLiked";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import { addDocument } from "../../../firebase/services";
import { useFireStore } from "../../../hooks/useFirestore";
// import { Comment } from "./Comment";
import "./style.scss";

const Comment = React.lazy(() => import("./Comment"));

const { Text, Paragraph } = Typography;
export default function ShowCardModal() {
  const {
    openCardModal,
    setOpenCardModal,
    postInf,
    setPostInf,
    listCardProfile,
    setUserInf,
  } = useContext(AppContext);
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext);
  const [inputText, setInputText] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [listPostProfile, setListPostProfile] = useState({});
  const [liked, setLiked] = useState(false);
  const history = useHistory();
  const antIcon = <LoadingOutlined style={{ fontSize: 24,}} spin />;
  
  

  const handleComment = (e) => {
    if (e.target.value.length > 0) {
      setIsSubmit(true);
    } else setIsSubmit(false);
    setInputText(e.target.value);
  };

  // Add comment to "comment" collection
  const hanldeSubmit = () => {
    addDocument("comment", {
      commentText: inputText,
      uid,
      displayName,
      photoURL,
      createdAt: new Date(),
      postId: postInf.postId,
    });
    setInputText("");
  };

  useEffect(() => {
    setListPostProfile(postInf);
    
  }, [postInf]);
  
  const commentsCondition = useMemo(() => {
    return {
      fieldName: "postId",
      operator: "==",
      compareValue: listPostProfile.postId,
    };
  }, [listPostProfile.postId]);

  // Call function to get data from firestores
  const comments = useFireStore("comment", commentsCondition);

  // Next and prev Card
  const hanldeChangeCard = async (position) => {
    let index = listPostProfile.index;
    console.log("index", index);
    console.log("position", position);
    if (position === "right") {
      index = index + 1;
    } else {
      index = index - 1;
    }
    console.log("index After", index);
    console.log("listCardProfile.length", listCardProfile);
    if (index > listCardProfile.length - 1 || index < 0) {
      return;
    } else {
      listCardProfile.map((item, ind) => {
        if (ind === index) {
          console.log("ind", ind);
          console.log("item", item);
          const post = { ...item, index };
          setListPostProfile(post);
        }
      });
    }
  };
  const likeCondition = useMemo(() => {
    return {
      fieldName: "postId",
      operator: "==",
      compareValue: listPostProfile.postId,
    };
  }, [listPostProfile.postId]);
  const countLikedCard = useFireStore("post", likeCondition);

  useEffect(() => {
    if (countLikedCard[0]?.userLiked.some((item) => item.uid === uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    
  }, [countLikedCard]);
  // console.log({postInf});
  const hanldeLike = async () => {
    if (liked) {
      await handleUnLikeCard(listPostProfile.postId, uid, displayName, photoURL);
      setLiked(false);
    } else {
      await handleLikeCard(listPostProfile.postId, uid, displayName, photoURL);
      setLiked(true);
    }
  };
  
  // redirect to profile page with uid
  const hanldeSearch = () => {
    setUserInf({
      displayName: listPostProfile?.displayName,
      photoURL: listPostProfile?.img,
      uid: listPostProfile.uid,
    });
    setOpenCardModal(false);
    history.push("/profile", listPostProfile.uid);
  };
  return (
    <div>
      <Modal
        centered
        visible={openCardModal}
        onOk={() => setOpenCardModal(false)}
        onCancel={() => setOpenCardModal(false)}
        width={1000}
        footer={null}
        style={{ padding: 0 }}
        closable={false}
      >
        <div className="card__modal__wrap">
          <div className="card__modal__wrap__after">
            <LeftOutlined onClick={() => hanldeChangeCard("left")} />
          </div>
          <div className="card__modal__img__wrap">
            <img
              className="card__modal__img"
              src={listPostProfile.imgPost}
              alt=""
            />
          </div>
          <div className="card__modal__info">
            <div className="card__modal__info__header">
              <Avatar
                size="default"
                style={{ cursor: "pointer" }}
                onClick={hanldeSearch}
                src={
                  listPostProfile?.userInf
                    ? listPostProfile?.userInf?.img
                    : listPostProfile.img
                }
              />
              <div className="card__modal__info__header__right">
                <Text
                  style={{ fontWeight: 500, cursor: "pointer" }}
                  onClick={hanldeSearch}
                >
                  {listPostProfile?.userInf
                    ? listPostProfile?.userInf?.displayName
                    : listPostProfile.displayName}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                    lineHeight: "1.4rem",
                    cursor: "pointer",
                  }}
                >
                  ...
                </Text>
              </div>
            </div>
            <div className="card__modal__info__content" style={{ padding: 12 }}>
              {/* Tieu de bai post */}
              <div style={{ display: "flex", marginBottom: 40 }}>
                <div>
                  <Avatar
                    onClick={hanldeSearch}
                    size="default"
                    style={{ cursor: "pointer" }}
                    src={
                      listPostProfile?.userInf
                        ? listPostProfile?.userInf?.img
                        : listPostProfile.img
                    }
                  />
                </div>
                <div className="card__modal__info__content__post">
                  <Paragraph
                    style={{ marginBottom: 0, marginLeft: 10 }}
                    ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}
                  >
                    <Text
                      onClick={hanldeSearch}
                      style={{
                        fontWeight: 500,
                        cursor: "pointer",
                        marginRight: 8,
                      }}
                    >
                      {listPostProfile?.userInf
                        ? listPostProfile?.userInf?.displayName
                        : listPostProfile.displayName}
                    </Text>
                    {listPostProfile.content}
                  </Paragraph>
                </div>
              </div>
              {/* end */}
              {/* comment start */}
              <React.Suspense fallback={<div style={{display:"flex", justifyContent:"center"}}><Spin indicator={antIcon}/></div>}>
                {comments?.map((comment) => (
                  <Comment
                    commentInf={comment}
                    key={comment.commentText}
                    onClick={hanldeSearch}
                  />
                ))}
              </React.Suspense>

              {/* comment end */}
            </div>
            <div className="card__modal__info__footer">
              <div style={{ display: "flex", marginTop: 10 }}>
                <div onClick={hanldeLike}>
                  {liked ? (
                    <img
                      className={liked ? "img__heart-like" : ""}
                      src="/heart-red.png"
                      alt=""
                      style={{
                        width: 27,
                        height: 27,
                        marginLeft: 10,
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    ""
                  )}
                  {!liked ? (
                    <img
                      className={!liked ? "img__heart-like" : ""}
                      src="/heart-black.png"
                      alt=""
                      style={{
                        width: 27,
                        height: 27,
                        marginLeft: 10,
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <MessageOutlined
                  style={{ fontSize: 25, marginLeft: 22, cursor: "pointer" }}
                />
                <SendOutlined
                  style={{ fontSize: 25, marginLeft: 22, cursor: "pointer" }}
                />
              </div>
              <div
                style={{
                  borderBottom: "1px solid rgb(220, 220, 220)",
                  paddingBottom: 8,
                }}
              >
                <Text
                  strong
                  style={{
                    marginLeft: 12,
                    marginBottom: 8,
                    cursor: "pointer",
                  }}
                >
                  {countLikedCard[0]?.userLiked?.length} lượt thích
                </Text>
                <br />
                <Text
                  style={{
                    marginLeft: 12,
                    marginBottom: 4,
                    color: "rgb(150, 150, 150)",
                    fontSize: ".8rem",
                  }}
                >
                  {}
                  {formatDate(listPostProfile?.createdAt?.seconds)}
                </Text>
              </div>
              <Form className="card__formik__comment">
                <SmileOutlined style={{ fontSize: 25, marginLeft: 10 }} />
                <Input
                  type="text"
                  name="comment"
                  className="card__input__commnent"
                  placeholder="Thêm bình luận..."
                  onChange={handleComment}
                  value={inputText}
                  autoComplete="false"
                />
                <Button
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    marginRight: 10,
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: "#fff",
                    color: `${
                      !isSubmit ? "rgba(180,180,180, 0.7)" : "#0095f6"
                    }`,
                  }}
                  disabled={!isSubmit}
                  onClick={hanldeSubmit}
                >
                  Đăng
                </Button>
              </Form>
            </div>
          </div>
          <div className="card__modal__wrap__before">
            <RightOutlined onClick={() => hanldeChangeCard("right")} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
