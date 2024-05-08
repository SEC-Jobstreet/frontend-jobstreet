import { Link } from "react-router-dom";

import styles from "./recentresearch.module.css";

function RecentResearch() {
  const historySearch = JSON.parse(localStorage.getItem("historySearch")) || [];
  const data = historySearch.map((item) => {
    let title = "";
    if (item.keyword === "" && item.location === "") {
      title = "Tất cả việc làm";
    } else if (item.keyword === "") {
      title = item.location;
    } else {
      title = `${item.keyword} - ${item.location}`;
    }
    return {
      title,
      keyword: item.keyword,
      location: item.location,
    };
  });
  const handleClearButtonClick = () => {
    localStorage.removeItem("historySearch");
    window.location.reload();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.historySearchHeader}>
        <h3 className={styles.header}>Tìm kiếm gần đây</h3>
        <button
          className={styles.clearButton}
          type="button"
          onClick={handleClearButtonClick}
        >
          Xoá
        </button>
      </div>
      {data.map((item) => (
        <Link
          to={`/search?keyword=${item.keyword}&location=${item.location}`}
          className={styles.recentResearch}
        >
          <div className={styles.title}>{item.title}</div>
          <div className={styles.number}>123</div>
        </Link>
      ))}
    </div>
  );
}

export default RecentResearch;
