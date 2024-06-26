import { useEffect, useRef, useState } from "react";
import { Button, Form, FormLabel } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import PhoneInput, {
  getCountryCallingCode,
  isPossiblePhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "../../services/configAPI";

import Input from "./input/input";
import FileUpload from "./fileupload";
import Radio from "./radio";
import WorkShift from "./workshift";

import "react-phone-number-input/style.css";
import "./phoneinput.css";
import styles from "./profile.module.css";

const cx = classNames.bind(styles);
const TEXTAREA_MAX_LENGTH = 300;

function ProfileEdit() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [errorFirstName, setErrorFirstName] = useState(false);

  const [lastName, setLastName] = useState("");
  const [errorLastName, setErrorLastName] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("+84");
  const [errorPhoneNumber, setErrorPhoneNumber] = useState(false);

  const [address, setAddress] = useState("");
  const [errorAddress, setErrorAddress] = useState(false);

  const [visa, setVisa] = useState(0); // 0: dont choose yet, 1: option 1, 2: option 2, 3: invalid (submit but didnt choose)
  const [secureSetting, setSecureSetting] = useState(0); // 0: dont choose yet, 1: option 1, 2: option 2, 3: invalid (submit but didnt choose)

  const [position, setPosition] = useState("");
  const [startingDate, setStartingDate] = useState("");

  const [whenever, setWhenever] = useState(false);
  const [particularTime, setParticularTime] = useState([
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false],
  ]);
  const [errorWorkShift, setErrorWorkShift] = useState(false);

  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  const [errorFile, setErrorFile] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [aboutMe, setAboutMe] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect");
  const isApplying = redirect !== null;

  useEffect(() => {
    const newDate = new Date().toISOString().split("T")[0];
    setMaxDate(newDate);
  }, []);

  useEffect(() => {
    const getCandidateProfile = async () => {
      const response = await getProfile();
      console.log(response);
      if (response.status === 200) {
        setIsEdit(true);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
        setPhoneNumber(
          `+${getCountryCallingCode(response.data.CountryPhone)}${response.data.Phone}`
        );
        setAboutMe(response.data.Description);
        setAddress(response.data.Address);
        setVisa(response.data.Visa ? 2 : 1);
        setPosition(response.data.CurrentPosition);

        const date = new Date(parseInt(response.data.StartDate, 10) * 1000)
          .toISOString()
          .split("T")[0];

        setStartingDate(date);
        setWhenever(response.data.WorkWhenever);
        setParticularTime(JSON.parse(response.data.WorkShift));
        setSecureSetting(response.data.ShareProfile ? 1 : 2);
      }
    };
    getCandidateProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;
    if (firstName === "") {
      error = true;
      setErrorFirstName(true);
    }
    if (lastName === "") {
      error = true;
      setErrorLastName(true);
    }
    if (
      phoneNumber === "" ||
      phoneNumber === undefined ||
      !isPossiblePhoneNumber(phoneNumber)
    ) {
      error = true;
      setErrorPhoneNumber(true);
    }
    if (address === "") {
      error = true;
      setErrorAddress(true);
    }
    if (visa === 0) {
      error = true;
      setVisa(3);
    }
    if (secureSetting === 0) {
      error = true;
      setSecureSetting(3);
    }

    if (!whenever) {
      let check = false;
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 7; j += 1) {
          if (particularTime[i][j]) {
            check = true;
            break;
          }
        }
        if (check) break;
      }
      if (!check) {
        error = true;
        setErrorWorkShift(true);
      }
    }
    if (errorFile) {
      error = true;
    }
    if (error) {
      window.scrollTo(0, 0);
    } else {
      const request = new FormData();
      request.append("last_name", lastName.trim());
      request.append("first_name", firstName.trim());
      const countryPhone = parsePhoneNumber(phoneNumber).country;
      request.append("country_phone", countryPhone);
      let phone = phoneNumber.split(getCountryCallingCode(countryPhone))[1];
      if (phone[0] === "0") {
        phone = phone.slice(1);
      }

      request.append("phone", phone);
      request.append("address", address.trim());
      // request.append('latitude', latitude);
      // request.append('longitude', longitude);
      request.append("visa", visa === 2);
      if (aboutMe.trim() !== "") {
        request.append("description", aboutMe.trim());
      }
      if (position.trim() !== "") {
        request.append("current_position", position.trim());
      }
      if (startingDate.trim() !== "") {
        request.append("start_date", new Date(startingDate).getTime() / 1000);
      }
      request.append("work_whenever", whenever);
      request.append(
        "work_shift",
        JSON.stringify(
          whenever
            ? [
                [true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true],
                [true, true, true, true, true, true, true],
              ]
            : particularTime
        )
      );
      request.append("share_profile", secureSetting === 1);

      if (file && file.size !== 0) {
        request.append("resume", file);
      }

      if (isEdit) {
        const response = await updateProfile(request);
        console.log(response);
        if (response.status === 200) {
          navigate("/account/profile");
        }
        window.scrollTo(0, 0);
      } else {
        const response = await createProfile(request);
        console.log(response);
        if (response.status === 200) {
          if (isApplying) {
            navigate(redirect);
          } else {
            navigate("/account/profile");
          }
        }
        window.scrollTo(0, 0);
      }
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
  };

  const handleAboutMeInput = (e) => {
    if (aboutMe.length < TEXTAREA_MAX_LENGTH) {
      setAboutMe(e.target.value);
    }
  };

  return (
    <>
      <Helmet>
        <title>Tạo hồ sơ | JobStreet</title>
      </Helmet>
      <div className={cx("my-profile")}>
        <h2 className={cx("my-profile-tilte")}>Tạo hồ sơ</h2>
        {isApplying && (
          <div className={cx("noti-banner")}>
            <div className="row" style={{}}>
              Hãy tạo hồ sơ cá nhân để ứng tuyển
            </div>
          </div>
        )}
        <form id="myProfile" onSubmit={handleSubmit}>
          <div className={cx("basic-info")}>
            <Input
              setInput={setFirstName}
              input={firstName}
              error={errorFirstName}
              type="text"
              label="Tên"
              errorMessage="Mục này bắt buộc"
              name="firstName"
              required
            />
            <Input
              setInput={setLastName}
              input={lastName}
              error={errorLastName}
              type="text"
              label="Họ"
              errorMessage="Mục này bắt buộc"
              name="lastName"
              required
            />
            <div className={cx("phone-number-title")}>Số điện thoại</div>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="VN"
              value={phoneNumber}
              onChange={(e) => {
                if (e === undefined) {
                  setPhoneNumber("+84");
                } else setPhoneNumber(e);
              }}
            />
            {errorPhoneNumber &&
              (phoneNumber === undefined ||
              phoneNumber === "" ||
              phoneNumber === "+84" ? (
                <div className={cx("invalid-feedback-input")}>
                  Mục này bắt buộc
                </div>
              ) : (
                !isPossiblePhoneNumber(phoneNumber || "") && (
                  <div className={cx("invalid-feedback-input")}>
                    Vui lòng nhập số điện thoại hợp lệ
                  </div>
                )
              ))}
            {/* create google api key and add react google autocomplete when needed */}
            <Input
              setInput={setAddress}
              input={address}
              error={errorAddress}
              type="text"
              label="Địa chỉ"
              errorMessage="Vui lòng nhập địa chỉ của bạn"
              name="address"
              required
            >
              <span className={cx("address-description")}>
                Chia sẻ địa chỉ của bạn để xem được nhiều hơn các vị trị gần đó.
                Chỉ tên huyện/tỉnh sẽ hiển thị trên hồ sơ của bạn.
              </span>
            </Input>
          </div>
          <div className={cx("work-eligibility")}>
            <div className={cx("work-eligibility-title")}>
              Điều nào sau đây miêu tả đúng nhất thị thực làm việc của bạn ở
              Việt Nam?
            </div>
            <Radio
              value={visa}
              checkedValue={1}
              setValue={setVisa}
              id="workEligibility1"
            >
              <p>
                Tôi <b>không phải</b> là Công dân hay Thường trú nhân của Việt
                Nam và tôi cần Nhà tuyển dụng nộp đơn xin giấy phép lao
                động/giấy phép/visa cho tôi.
              </p>
            </Radio>
            <Radio
              value={visa}
              checkedValue={2}
              setValue={setVisa}
              id="workEligibility2"
            >
              <p>
                Tôi là Công dân, Thường trú nhân hoặc có tư cách tương tự ở Việt
                Nam và sẽ không cần Nhà tuyển dụng nộp đơn xin giấy phép lao
                động/giấy phép/visa cho tôi.
              </p>
            </Radio>

            {visa === 3 && (
              <div className={cx("invalid-feedback-input")}>
                Mục này bắt buộc
              </div>
            )}
          </div>
          <Form.Group className={cx("reasons")}>
            <FormLabel>Tuyển dụng tôi vì (tùy chọn)</FormLabel>
            <Form.Control
              as="textarea"
              placeholder={`Hãy cho chúng tôi biết điều gì khiến bạn nổi bật!
  Ví dụ: Tôi là nhân viên thứ ký có 3 năm kinh nghiệm, gõ thành thạo 60 từ một phút và có chúng chỉ MS Excel`}
              style={{ height: "130px" }}
              value={aboutMe}
              onChange={handleAboutMeInput}
              className={cx("textarea-custom")}
            />
            <p className={cx("textarea-letter-number")}>
              Số ký tự tối đa: {TEXTAREA_MAX_LENGTH - aboutMe.length}
            </p>
          </Form.Group>
          <hr className={cx("horizontal-line")} />
          <div className={cx("work-position")}>
            <Input
              setInput={setPosition}
              input={position}
              type="text"
              label="Chức danh hiện tại (tùy chọn)"
              name="position"
            />
            {position !== "" && (
              <Input
                setInput={setStartingDate}
                input={startingDate}
                type="date"
                label="Ngày bắt đầu vị trí hiện tại (tùy chọn)"
                name="currentRoleStartDate"
                max={maxDate}
              />
            )}
          </div>
          <hr className={cx("horizontal-line")} />
          <WorkShift
            whenever={whenever}
            setWhenever={setWhenever}
            particularTime={particularTime}
            setParticularTime={setParticularTime}
            errorWorkShift={errorWorkShift}
          />
          <hr className={cx("horizontal-line")} />
          <div className={cx("work-eligibility")}>
            <p className={cx("tilte")}>Cài đặt Bảo Mật</p>
            <Radio
              value={secureSetting}
              checkedValue={1}
              setValue={setSecureSetting}
              id="secureSetting1"
            >
              <div className={cx("normal-text")}>
                <span>
                  Chia sẻ hồ sơ{" "}
                  <span className={cx("purple-badge")}>Gợi ý</span>
                </span>
                <br />
                <span className={cx("small-text", "text-grey", "mt-1 d-block")}>
                  Nhà tuyển dụng có thể xem hồ sơ của tôi và liên hệ với tôi về
                  các cơ hội việc làm tiềm năng.
                </span>
              </div>
            </Radio>
            <div style={{ height: "1.4rem" }} />
            <Radio
              value={secureSetting}
              checkedValue={2}
              setValue={setSecureSetting}
              id="secureSetting2"
            >
              <div className={cx("normal-text")}>
                <span>Không chia sẻ hồ sơ</span>
                <br />
                <span className={cx("small-text", "text-grey", "mt-1 d-block")}>
                  Hồ sơ của tôi chỉ có thể được nhìn thấy bởi nhà tuyển dụng khi
                  nộp đơn ứng tuyển.
                </span>
              </div>
            </Radio>
            {secureSetting === 3 && (
              <div className={cx("invalid-feedback-input")}>
                Mục này bắt buộc
              </div>
            )}
          </div>
          <hr className={cx("horizontal-line")} />
          <div>
            <p className={cx("tilte")}>Sơ yếu lý lịch</p>
            <FileUpload
              setFile={setFile}
              file={file}
              fileInputRef={fileInputRef}
              error={errorFile}
              setError={setErrorFile}
            />
            <p className={cx("normal-text", "text-grey")}>
              Loại tập tin: .pdf, .doc, .docx. Kích thước tối đa của tệp: 4.3
              MB.
            </p>
          </div>
          <div className={cx("actions-container")}>
            <Button
              type="button"
              className={cx("outline-button", "button-custom")}
              onClick={handleCancel}
            >
              Huỷ bỏ
            </Button>
            <Button
              type="submit"
              className={cx("filled-button", "button-custom")}
              onClick={handleSubmit}
            >
              {isEdit ? "Cập nhật hồ sơ" : "Tạo hồ sơ"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProfileEdit;
