import { Input, Modal, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { AppContext } from "../../../Context/AppProvider";
import { AuthContext } from "../../../Context/AuthProvider";
import { addDocument, stringToHash, uploadFile } from "../../../firebase/services";
import "./style.scss";

export const AddCardModal = () => {
  const { openAddCardModal, setOpenAddCardModal } = useContext(AppContext);
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const [fileList, setFileList] = useState([]);
  const [isValidForm, setIsValidForm] = useState(false);
  const history = useHistory();
  const initialValues = {
    title: "",
  };

  const onChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      setIsValidForm(true);
      console.log("true");
    } else {
      setIsValidForm(false);
      console.log("false");
    }
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  // Submit and add data to firestores
  const handleOk = (values) => {
    uploadFile("posts", uid, fileList[0])
      .then((img) => {
        const data = {
          content: values.title,
          imgPost: img,
          createdAt: new Date(),
          postId: stringToHash(uid + new Date().toString()).toString(),
          uid: uid,
          userLiked: [],
          userInf: {
            displayName: displayName,
            img: photoURL,
          },
        };
        return data;
      })
      .then((data) => {
        addDocument("post", data);
      })
      .then(() => {
        history.push("/profile");
      });

    setOpenAddCardModal(false);
  };

  const handleCancel = () => {
    setOpenAddCardModal(false);
  };

  return (
    <>
      <Modal footer={null} title="Thêm bài viết" visible={openAddCardModal} onOk={handleOk} onCancel={handleCancel}>
        <Formik
          style={{ marginTop: 8 }}
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={handleOk}
        >
          {(formikProps) => {
            const { isSubmitting, values, handleChange } = formikProps;
            return (
              <Form className="form__add__card">
                <Input
                  type="text"
                  name="title"
                  className="form__add__card__input"
                  placeholder="Tiêu đề..."
                  onChange={handleChange}
                  //  onBlur={handleBlur}
                  value={values.title}
                />
                <div style={{ height: 300 }}>
                  <ImgCrop rotate>
                    <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture-card" fileList={fileList} onChange={onChange} onPreview={onPreview}>
                      {fileList.length === 1 ? "" : fileList.length < 2 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
                </div>
                <div className="form__add__card__button">
                  <button
                    style={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      padding: 10,
                      cursor: "pointer",
                      border: "none",
                      backgroundColor: "#fff",
                      color: `${!isValidForm ? "rgba(180,180,180, 0.7)" : "#0095f6"}`,
                    }}
                    disabled={!isValidForm}
                    className={!isValidForm ? "form__add__card__button-invalid" : ""}
                    type="submit"
                    // disabled={isSubmitting}
                  >
                    Đăng
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};
