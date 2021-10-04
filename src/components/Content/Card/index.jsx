import {
  MessageOutlined,
  SendOutlined,
  SmileOutlined
} from "@ant-design/icons";
import { Avatar, Card, Input, Typography } from "antd";
import Form from "antd/lib/form/Form";
import { Formik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import { useHistory } from "react-router";
import { formatDate } from "../../../constants/formatDate";
import {
  handleLikeCard,
  handleUnLikeCard
} from "../../../constants/handleLiked";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { useFireStore } from "../../../hooks/useFirestore";
import "./style.scss";
const { Text, Paragraph } = Typography;
function CardComponent(props) {
  const { user } = useContext(AuthContext);
  const { userInf, postId, imgPost, createdAt, content, uid } = props.data;
  const { setOpenCardModal, setPostInf, setUserInf } = useContext(AppContext);
  const [liked, setLiked] = useState(false);
  const [isActive, setActive] = useState("false");
  const history = useHistory();

  // listen event in "post" colection
  const likeCondition = useMemo(() => {
    return {
      fieldName: "postId",
      operator: "==",
      compareValue: postId,
    };
  }, [postId]);
  const countLikedCard = useFireStore("post", likeCondition);
  useEffect(() => {
    if (countLikedCard[0]?.userLiked.some((item) => item.uid === user.uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [countLikedCard]);

  // Open Modal card when clic "Xem tat ca binh luan"
  const handleToggleModal = () => {
    const postInf = {
      ...userInf,
      imgPost,
      postId,
      content,
      createdAt,
      uid,
    };
    setPostInf(postInf);
    setOpenCardModal(true);
  };

  // Set state of heart
  const hanldeLike = async () => {
    setActive(!isActive);
    if (liked) {
      await handleUnLikeCard(postId, user.uid, user.displayName, user.photoURL);
      setLiked(false);
      setActive(!isActive);
    } else {
      await handleLikeCard(postId, user.uid, user.displayName, user.photoURL);
      setLiked(true);
    }
  };

  // set animation in button like
  // redirect to profile page with uid
  const hanldeSearch = () => {
    setUserInf({
      displayName: userInf?.displayName,
      photoURL: userInf?.img,
      uid,
    });
    history.push("/profile", uid);
  };
  return (
    <Card
      className="card__wrap"
      extra={
        <a onClick={hanldeSearch}>
          <Avatar alt="example" src={userInf?.img || <Skeleton/>} />
          <Text strong style={{ marginLeft: 20, cursor: "pointer" }}>
            {userInf?.displayName}
          </Text>
        </a>
      }
      bordered={false}
      style={{ width: "100%", marginTop: 30 }}
      cover={<img alt="example" src={imgPost || <Skeleton height={100}/>} />}
    >
      <div className="card__body">
        <div style={{ display: "flex" }}>
          <div onClick={hanldeLike}>
            {liked ? (
              <img
                className={liked ? "img__heart-like" : ""}
                src="/heart-red.png"
                // onClick={hanldeToggeLike}
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
                // onClick={hanldeToggeLike}
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

        <div className="card__bottom__wrap">
          <Text
            strong
            style={{
              marginLeft: 10,
              marginBottom: 8,
              cursor: "pointer",
            }}
          >
            {countLikedCard[0]?.userLiked?.length} lượt thích
          </Text>
          <br />
          <div className="card__bottom__user-content">
            <Text
              strong
              style={{ marginLeft: 10, cursor: "pointer" }}
              onClick={hanldeSearch}
            >
              {userInf?.displayName}
            </Text>
            <Paragraph
              style={{ marginLeft: 10, marginBottom: 4 }}
              ellipsis={{ rows: 2, expandable: true, symbol: "Thêm" }}
            >
              {content}
            </Paragraph>
          </div>
          <Text
            onClick={() => {
              handleToggleModal();
            }}
            style={{
              marginLeft: 10,
              marginBottom: 4,
              color: "rgb(150, 150, 150)",
              cursor: "pointer",
            }}
          >
            Xem tất cả bình luận
          </Text>
          <br />
          <Text
            style={{
              marginLeft: 10,
              marginBottom: 4,
              color: "rgb(150, 150, 150)",
            }}
          >
            {formatDate(createdAt.seconds)}
          </Text>
        </div>
      </div>
      <div className="hr"></div>
      <div className="card__formik__wrap">
        <Formik
          style={{ marginTop: 8 }}
          // initialValues={initialValues}
          // validationSchema={validationSchema}
          // onSubmit={props.onSubmit}
        >
          {(formikProps) => {
            return (
              <Form className="card__formik__comment">
                <SmileOutlined style={{ fontSize: 25, marginLeft: 10 }} />
                <Input
                  type="text"
                  name="keySearch"
                  className="card__input__commnent"
                  placeholder="Thêm bình luận..."
                  //  onChange={handleChange}
                  //  onBlur={handleBlur}
                  //  value={values.email}
                />
                <Text
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#0095f6",
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                >
                  Đăng
                </Text>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Card>
  );
}

export default CardComponent;
