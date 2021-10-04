import { CloseCircleOutlined, FacebookFilled, LoadingOutlined } from "@ant-design/icons";
import { Col, Input, notification, Row, Spin, Typography } from "antd";
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { openNotification } from "../../../components/Nofication";
import { AppContext } from "../../../Context/AppProvider";
import { addDocument, generateKeywords } from "../../../firebase/services";
import firebase, { auth } from "./../../../firebase/config";
import "./style.scss";
const { Title } = Typography;

const Login = (props) => {
  const { setIsLoading, setIsValidAuth } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(false);
  const initialValues = {
    email: "",
    password: "",
  };
  const history = useHistory();
  const handleFBLogin = async () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    const { additionalUserInfo, user } = await auth.signInWithPopup(fbProvider);
    setIsLoading(true);
    if (additionalUserInfo.isNewUser) {
      addDocument("users", {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        providerId: additionalUserInfo.providerId,
        keyword: generateKeywords(user.displayName),
        listFollow: [],
        listFollower: [],
        isOnline: true,
        nofication: true,
        description: "",
      });
    }
    setIsLoading(false);
    history.push("/");
  };

  const hanldeLogin = async (values) => {
    try {
      const response = await auth.signInWithEmailAndPassword(values.email, values.password);
      if (response) {
        console.log("ok");
        setIsLoading(true);
      }
    } catch (error) {
      openNotification("topRight", "Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu.", "error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "rgb(220,220,220)" }} spin />;
  return (
    <div className="login__wrap">
      <Row justify="center">
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 10 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 6 }} className="login__form-top">
          <Title className="login__form__title">Instagram</Title>
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={hanldeLogin}
          >
            {(formikProps) => {
              const { isSubmitting, values, handleChange } = formikProps;
              return (
                <Form>
                  <Input
                    type="email"
                    name="email"
                    className="login__input-text"
                    placeholder="Số điện thoại hoặc Gmail..."
                    onChange={handleChange}
                    //  onBlur={handleBlur}
                    value={values.email}
                    required
                  />
                  <Input
                    type="password"
                    name="password"
                    className="login__input-text"
                    placeholder="Mật khẩu..."
                    onChange={handleChange}
                    //  onBlur={handleBlur}
                    value={values.password}
                    required
                  />

                  <button type="primary" className="login__btn-login">
                    <span>{isSubmitting ? <Spin indicator={antIcon} /> : "Đăng nhập"}</span>
                  </button>
                  {/* <Button type="submit">
                    {isSubmitting && <Spin size="sm" />}
                    <span>Đăng nhập</span>
                  </Button> */}
                </Form>
              );
            }}
          </Formik>
          <div className="login__Pseudo">
            <div className="login__Pseudo-left"></div>
            <div className="login__Pseudo-center">
              <span>HOẶC</span>
            </div>
            <div className="login__Pseudo-right"></div>
          </div>
          <div type="primary" size="middle" className="login__btn-loginFB" onClick={handleFBLogin} style={{ textAlign: "center", cursor: "pointer" }}>
            <span>
              <FacebookFilled /> Đăng nhập bằng Facebook
            </span>
          </div>
        </Col>
      </Row>
      <Row justify="center" className="login__wrap__bottom">
        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 10 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 6 }} className="login__form-bottom">
          <div className="register__content">
            <span>Bạn chưa có tài khoản ư? </span>
            <a
              onClick={() => {
                history.push("/register");
              }}
            >
              Đăng ký
            </a>
          </div>
        </Col>
      </Row>
    </div>
  );
};

Login.propTypes = {};

export default Login;
