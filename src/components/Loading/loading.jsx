import "./style.scss";
import * as React from "react";
import { AppContext } from "../../Context/AppProvider";
import { InstagramOutlined } from "@ant-design/icons";

export const Loading = () => {
  const { isLoading } = React.useContext(AppContext);
  return (
    <div className="loading__page">
      {isLoading ? (
        <div className="loading__page__icon">
            <InstagramOutlined className="loading__page__img"/>
        
        </div>
      ) : ("")}
    </div>
  );
};
