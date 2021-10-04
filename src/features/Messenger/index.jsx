import { Layout, Row, Col } from "antd";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppProvider";
import ChatWindow from "./../Messenger/ChatWindow";
import SideBar from "./../Messenger/SideBar";
import "./style.scss";
const { Content } = Layout;

const Messenger = () => {
  const { setIconHome, setIconMessage, setIconProfile } = useContext(AppContext);

  useEffect(() => {
    setIconHome(false);
    setIconMessage(true);
    setIconProfile(false);
  },[]);
  return (
    <Content className="content__messenger">
      <Row>
        <Col
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 24, offset: 0 }}
          md={{ span: 24, offset: 0 }}
          lg={{ span: 24, offset: 2 }}
          xl={{ span: 24, offset: 0 }}
          xxl={{ span: 24, offset: 0 }}
          style={{ display: "flex" }}
        >
          <SideBar className="sideBar__mobile"/>
          <ChatWindow className="chatwindow__mobile"/>
        </Col>
      </Row>
    </Content>
  )
};

export default Messenger;
