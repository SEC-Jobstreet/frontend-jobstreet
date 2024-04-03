import NavBar from "./components/appnav";
import AppRouter from "./components/approuter";

import FilterBar from "./components/filterbar";
import SearchForm from "./components/searchform";

import Footer from "./components/footer";


import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <NavBar />
      <AppRouter />
      <SearchForm />
      <FilterBar />
      <Footer />
    </div>
  );
}

export default App;
