import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import Info from "../../../assets/svg/circle_info_icon.svg";
import Dismiss from "../../../assets/svg/dismiss_icon.svg";
import Email from "../../../assets/svg/email_icon.svg";
import Location from "../../../assets/svg/location_icon.svg";
import Search from "../../../assets/svg/search_icon.svg";
import Model from "../model/Model";

import "../index.css";

export default function CreateJobAlertModel(props) {
  const { onHideModelHandler } = props;
  const [inputKeyWords, setInputKeyWords] = useState("");
  const [inputLocation, setInputLocation] = useState("");

  const onInputChange = (event, identifier) => {
    const enteredValue = event.target.value;

    if (identifier === "key-word") {
      setInputKeyWords(enteredValue);
    }
    if (identifier === "location") {
      setInputLocation(enteredValue);
    }
  };
  const onClearInputHandler = (identifier) => {
    if (identifier === "key-word") {
      setInputKeyWords("");
    }

    if (identifier === "location") {
      setInputLocation("");
    }
  };
  return (
    <Model onHideModelHandler={onHideModelHandler}>
      <div
        className="content-container -width-md -margin-y-md"
        id="email-alert-management-page"
        style={{ width: "100%", overflowY: "auto", margin: "0px" }}
      >
        <h2 className="heading-large">
          <img src={Email} alt="email-icon" style={{ marginRight: "0.8rem" }} />
          Khám phá những việc làm mới cho tìm kiếm này
        </h2>
        <p>
          Luôn cập nhật với những vị trí tuyển dụng mới phù hợp với những tìm
          kiếm hiện tại của bạn.
        </p>
        <Form className="new_email_alert" id="email_alert_form" method="post">
          {/* từ khoá */}
          <Form.Group className="email-alert-container">
            <Form.Label htmlFor="email-alert-query">Từ khoá</Form.Label>
            <InputGroup className="email-alert">
              <Form.Control
                className="email-alert"
                placeholder="Tên việc, công ty, từ khóa"
                type="text"
                id="email-alert-query"
                value={inputKeyWords}
                onChange={(event) => onInputChange(event, "key-word")}
              />
              <InputGroup.Text id="dismiss">
                {inputKeyWords !== "" && (
                  <img
                    src={Dismiss}
                    alt="location icon"
                    onClick={() => onClearInputHandler("key-word")}
                    aria-hidden="true"
                  />
                )}
              </InputGroup.Text>
              <InputGroup.Text>
                <img src={Search} alt="search icon" />
              </InputGroup.Text>
            </InputGroup>
            <div className="field-description">
              <img
                src={Info}
                alt="info-icon"
                style={{
                  margin: "0px 0px 0px 5px",
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                style={{ color: "#0e8136", fontSize: "1.4rem", margin: "0px" }}
              >
                Vui lòng điền chức danh công việc một cách cụ thể nhất.
              </p>
            </div>
          </Form.Group>
          {/* địa điểm */}
          <Form.Group className="email-alert-container">
            <Form.Label htmlFor="email-alert-location">Địa điểm</Form.Label>
            <InputGroup className="email-alert">
              <Form.Control
                className="email-alert"
                placeholder="Thành phố, quận, huyện"
                type="text"
                id="email-alert-location"
                value={inputLocation}
                onChange={(event) => onInputChange(event, "location")}
              />
              <InputGroup.Text id="dismiss">
                {inputLocation !== "" && (
                  <img
                    src={Dismiss}
                    alt="location icon"
                    onClick={() => onClearInputHandler("location")}
                    aria-hidden="true"
                  />
                )}
              </InputGroup.Text>
              <InputGroup.Text>
                <img src={Location} alt="location icon" />
              </InputGroup.Text>
            </InputGroup>
            <div className="field-description">
              <img
                src={Info}
                alt="info-icon"
                style={{
                  margin: "0px 0px 0px 5px",
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                style={{ color: "#0e8136", fontSize: "1.4rem", margin: "0px" }}
              >
                Vui lòng điền chức danh công việc một cách cụ thể nhất.
              </p>
            </div>
          </Form.Group>

          <Button type="submit" className="email-alert primary">
            Thông báo việc tương tự
          </Button>
          <div className="privacy-statement heading-xxsmall">
            <span className="branded-links">
              Bằng cách tạo thông báo qua email, bạn đồng ý với{" "}
              <NavLink to="/">Các điều khoản và điều kiện sử dụng</NavLink> và{" "}
              <NavLink to="/">Chính Sách Bảo Mật</NavLink> của JobStreet Bạn có
              thể huỷ thông báo qua email bất cứ lúc nào.
            </span>
          </div>
        </Form>
      </div>
    </Model>
  );
}
