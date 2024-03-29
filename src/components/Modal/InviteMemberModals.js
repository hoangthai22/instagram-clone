import { Avatar, Form, Modal, Select, Spin } from "antd";
import { debounce } from "lodash";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MODAL_MODE_INVITE, MODAL_MODE_SEARCH_USER } from "../../constants/modalMode";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/services";
import { fetchUserList } from "./../../hooks/useFirestore";

function DebountSelect({ fetchOptions, debounceTimeout = 500, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [option, setOption] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOption([]);
      setFetching(true);

      // console.log("option", option);
      fetchOptions(value, props.curMembers).then((newOptions) => {
        setOption(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions]);

  return (
    <Select labelInValue filterOption={false} onSearch={debounceFetcher} notFoundContent={fetching ? <Spin size="small" /> : ""} {...props}>
      {option.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size="small" src={opt.photoURL}>
            {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {`${opt.label}`}
        </Select.Option>
      ))}
    </Select>
  );
}

export default function InviteMemberModals() {
  const { isInviteMember, setisInviteMember, setIsRoomChange, isShowModalMode, setUserInf } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [value, setValue] = useState([]);
  const [titleModal, setTitleModal] = useState("");
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    if (isShowModalMode === MODAL_MODE_SEARCH_USER) {
      setTitleModal("Tìm kiếm người dùng");
    } else if (isShowModalMode === MODAL_MODE_INVITE) {
      setTitleModal("Mời bạn");
    }
  }, [isShowModalMode]);

  const handleIOk = () => {
    if (value.length === 0) {
      setisInviteMember(false);
      return;
    }
    if (isShowModalMode === MODAL_MODE_SEARCH_USER) {
      setUserInf({
        displayName: value[0].label[1],
        photoURL: value[0].label[0].props.src,
        uid: value[0].value,
      });
      history.push("/profile", value[0].value);
    } else if (isShowModalMode === MODAL_MODE_INVITE) {
      addDocument("rooms", {
        members: [uid, value[0].key],
      });

      setIsRoomChange(true);
    }
    //reset for
    setisInviteMember(false);
    setValue([]);
    form.resetFields();
  };

  const handleCancel = () => {
    setisInviteMember(false);
    form.resetFields();
  };

  return (
    <div>
      <Modal title={titleModal} visible={isInviteMember} onOk={handleIOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" style={{ margin: 20 }}>
          <DebountSelect
            mode="multiple"
            label="Member name"
            value={value}
            placeholder="Nhập tên..."
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curMembers={uid ? uid : ""}
          />
        </Form>
      </Modal>
    </div>
  );
}
