import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Movie from "./Routes/Movie";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />}></Route>
        <Route path="/movie/*" element={<Movie />}></Route>
        <Route path="/tv/*" element={<Tv />}></Route>
        <Route path="/search/*" element={<Search />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
