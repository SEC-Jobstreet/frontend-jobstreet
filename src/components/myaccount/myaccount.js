import { NavLink, useLocation } from "react-router-dom";

import "./myaccount-style.css";

function MyAccount(props) {
  const { children } = props;
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect");

  if (redirect !== null) {
    return (
      <div className="account-page">
        <div className="main-content">{children}</div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container-page">
        <div className="sidebar">
          <h4 className="sidebar-header mb-3">Tài khoản</h4>
          <NavLink to="/account/profile" className="nav-item nav-link">
            Hồ sơ cá nhân
          </NavLink>
          <NavLink to="/account/job-alerts" className="nav-item nav-link">
            Thông báo việc
          </NavLink>
          <NavLink to="/account/save-jobs" className="nav-item nav-link">
            Việc của tôi
          </NavLink>
          <NavLink to="/account/settings" className="nav-item nav-link">
            Cài đặt
          </NavLink>
          <NavLink
            to="/account/deletion-confirmation"
            className="nav-item nav-link"
          >
            Xoá tài khoản
          </NavLink>
        </div>
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}

export default MyAccount;
