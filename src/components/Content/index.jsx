import { Col, Layout, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { db } from "../../firebase/config";
import CardComponent from "./Card";
import "./style.scss";


const { Content } = Layout;
const { Text } = Typography;

const ContentComponent = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const { setIconHome, setIconMessage, setIsLoading, setIconProfile } = useContext(AppContext);
  const [listPost, setListPost] = useState([]);
  const [lastPost, setLastPost] = useState({});
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (user?.listFollow) {
      const oldListFollow = user?.listFollow.map(user => user.uid)
      const newListFollow =
        user?.listFollow?.length > 0
          ? [...oldListFollow, user.uid]
          : [user.uid];
      setIconHome(true);
      setIconMessage(false);
      setIconProfile(false);
      db.collection("post")
        .orderBy("createdAt", "desc")
        .where("uid", "in", newListFollow)
        .limit(2)
        .get()
        .then((snapshot) => {
          setLastPost(snapshot.docs[snapshot.docs.length - 1]);
          setListPost(snapshot.docs.map((doc) => ({ ...doc.data() })));
          setIsLoading(false);
        });
    }
    return () => {
      setListPost([]);
    };
  }, [user]);

  useEffect(() => {
    getData(loadMore);
    setLoadMore(false);
  }, [loadMore]);

  useEffect(() => {
    const list = document.getElementById("list");

    list.addEventListener("scroll", (e) => {
      const el = e.target;
      if (el.scrollTop + el.clientHeight === el.scrollHeight) {
        setLoadMore(true);
      }
    });
  }, []);

  function getData(loadMore) {
    if (loadMore) {
      if (lastPost?.exists) {
        const oldListFollow = user?.listFollow.map(user => user.uid)
        let newListPosts = [...listPost];
        const newListFollow = [...oldListFollow, user?.uid];
        console.log({newListFollow});
        db.collection("post")
          .orderBy("createdAt", "desc")
          .where("uid", "in", newListFollow)
          .limit(2)
          .startAfter(lastPost)
          .get()
          .then((snapshot) => {
            snapshot.docs.map((doc) => {
              setLastPost(snapshot.docs[snapshot.docs.length - 1]);
              newListPosts = [...newListPosts, doc.data()];
            });
            setListPost(newListPosts);
          });
          console.log({newListPosts});
      }
      
    }
  }

  return (
    <Content className="content" id="list">
      <Row style={{margin: "0 auto", maxWidth: 950}}> 
        <Col  className="content__container-left">
          {listPost?.map((card, index) => (
            <CardComponent data={card} key={card.postId} />
          ))}
        </Col>
        <Col
          className="content__container-right"
        >
          <div className="content__container-right-wrap">
            {user?.photoURL ? (
              <img
                alt="example"
                src={user.photoURL}
                className="content__container-right__img-avatar"
              />
            ) : (
              ""
            )}
            <div className="content__container-right__wrapName">
              <Text style={{ fontWeight: 500, cursor: "pointer" }}>
                {user.displayName}
                {` `}
              </Text>
              <Text style={{ color: "rgb(150, 150, 150)" }}>
                {user.displayName}
              </Text>
            </div>
            <Text
              style={{
                fontSize: ".8rem",
                fontWeight: 500,
                color: "#0095f6",
                marginLeft: 10,
                cursor: "pointer",
                alignSelf: "center",
              }}
            >
              Chuyển
            </Text>
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default ContentComponent;
