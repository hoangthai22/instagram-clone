import { CheckCircleTwoTone, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Avatar, Col, Input, Layout, notification, Row, Spin } from "antd";
import { Form, Formik } from "formik";
import React, { useContext } from "react";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { db } from "../../../firebase/config";
import "./style.scss";

const { Content } = Layout;
const { TextArea } = Input;
const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setOpenChangeAvatarModal } = useContext(AppContext);
  const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "rgb(220,220,220)" }} spin />;

  let initialValues = {
    email: user.email,
    name: user.displayName,
    description: user.description,
  };
  const openNotification = (placement) => {
    console.log(placement);
    notification.open({
      message: `Thông báo `,
      description: "Cập nhật thông tin thành công",
      placement,
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
    });
  };

  const handleEditProfile = (values, { setSubmitting }) => {
    console.log({ values });
    db.collection("users")
      .doc(user.id)
      .update({ description: values.description })
      .then(() => {
        setSubmitting(false);
      })
      .then(() => {
        setUser({ ...user, description: values.description });
        openNotification("topRight");
      });
  };

  return (
    <Content className="content__editProfile">
      <Row style={{ margin: "0 auto", maxWidth: 950 }}>
        <Col className="chatwindow__header" style={{width: "100%"}}>
          <div className="edit__profile__wrap">
            <div className="edit__profile__avatar">
              <Avatar src={user.photoURL} style={{ width: 70, height: 70, marginRight: 20 }}></Avatar>
              <span className="edit__profile__avatar__text" onClick={() => setOpenChangeAvatarModal(true)}>
                Thay đổi ảnh đại diện
              </span>
            </div>
            <div className="edit__profile__form">
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={handleEditProfile}
              >
                {(formikProps) => {
                  const { isSubmitting, values, handleChange } = formikProps;
                  return (
                    <Form>
                      <div style={{ display: "flex", gap: 30 }}>
                        <div className="edit__profile__form__label">
                          <label>Email</label>
                          <label>Tên người dùng</label>
                          <label style={{ marginTop: 85 }}>Bio</label>
                        </div>
                        <div className="edit__profile__form__input">
                          <Input
                            type="email"
                            name="email"
                            className="edit__profile-text"
                            placeholder="Email..."
                            onChange={handleChange}
                            //  onBlur={handleBlur}
                            value={values.email}
                            autoComplete="true"
                            readOnly
                          />
                          <div style={{width: "100%"}}>
                            <Input
                              type="text"
                              name="name"
                              className="edit__profile-text"
                              placeholder="Tên người dùng..."
                              onChange={handleChange}
                              //  onBlur={handleBlur}
                              value={values.name}
                              readOnly
                            />
                            <p className="edit__profile-p">{user.displayName} In most cases, you'll be able to change your username back to hoangthaiii for another 14 days. Learn More</p>
                          </div>
                          <TextArea
                            type="text"
                            name="description"
                            className="edit__profile-text"
                            placeholder="Bio..."
                            onChange={handleChange}
                            //  onBlur={handleBlur}
                            value={values.description}
                          />
                        </div>
                      </div>
                      <button type="submit" className="edit__profile__form-btn" disabled={isSubmitting}>
                        <span>{isSubmitting ? <Spin indicator={antIcon} /> : "Đồng ý"}</span>
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default EditProfile;
