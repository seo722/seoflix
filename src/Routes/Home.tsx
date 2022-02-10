import { motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Logo = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgb(204, 113, 113);
  opacity: 1;
  z-index: -2;
`;

const LogoVar = {};

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <>
      <Logo
        variants={LogoVar}
        animate={{ opacity: 0 }}
        transition={{ duration: 3 }}
      />
    </>
  );
}

export default Home;
