import React, { useContext } from "react";
import "./style.scss";
import { Button, Col, Typography } from "antd";
import { DownOutlined, UserAddOutlined } from "@ant-design/icons";
import ListUser from "../ListUser";
import { useSelector } from "react-redux";
import { AuthContext } from "../../../Context/AuthProvider";
import { AppContext } from "../../../Context/AppProvider";
const { Text } = Typography;

const SideBar = (props) => {
  const { user } = useContext(AuthContext);
  const { setisInviteMember, isMessage, setIsMessage } = useContext(AppContext);
  return (
    <Col
      xs={{ span: 24 }}
      sm={{ span: 7 }}
      md={{ span: 7 }}
      lg={{ span: 6, offset: 0 }}
      xl={{ span: 5, offset: 4}}
      xxl={{ span: 4, offset: 6 }}
      className={!isMessage ? "sidebar__header active-message" : "sidebar__header inactive-message"}
      style={{ marginTop: 90 }}
    >
      <div className="sidebar__header__wrap">
        <div className="sidebar__header__title">
          <Text
            strong
            className="sidebar__header__title-text"
            style={{ fontSize: "1rem" }}
          >
            {user.displayName}
            <DownOutlined style={{ marginLeft: 10 }} />
          </Text>
        </div>
        <div className="sidebar__header__tab">
          <Text
            strong
            className="sidebar__header__tab-text"
            style={{ fontSize: "1.1rem" }}
          >
            <span style={{ fontSize: "1rem" }}> Chính</span>
          </Text>
          <Text
            className="sidebar__header__tab-text"
            onClick={() => setisInviteMember(true)}
            type="text"
            style={{ fontSize: "1.1rem" }}
          >
            <UserAddOutlined />
            <span style={{ fontSize: "1rem" }}>Tìm bạn</span>
          </Text>
        </div>
        <ListUser />
      </div>
    </Col>
  );
};

export default SideBar;
