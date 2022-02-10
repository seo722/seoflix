import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies,
  getPopularMovies,
  getTopMovies,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const NextBtn = styled(motion.div)`
  position: absolute;
  right: 0;
  width: 50px;
  height: 200px;
  background-color: white;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const rowVar = {
  hidden: { x: window.innerWidth },
  visible: { x: 0 },
  exit: { x: -window.innerWidth },
};

const BoxVar = {
  normal: { scale: 1 },
  hover: {
    scale: 1.35,
    y: -50,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

const infoVar = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

const offset = 6;

function Sliders() {
  const history = useNavigate();
  const bigMovieMath = useMatch("/movie/:movieId");
  const { scrollY } = useViewportScroll();
  const { data: nowPlayingData, isLoading: isNowPlayingLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const { data: popularData, isLoading: isPopularLoading } =
    useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
  const { data: TopRatedData, isLoading: isTopRatedLoading } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], getTopMovies);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);

  const [leaving, setLeaving] = useState(false);
  const increaseIndex = (
    data: IGetMoviesResult | undefined,
    target: string
  ) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      switch (target) {
        case "nowPlaying":
          setNowPlayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
          break;
        case "popular":
          setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
          break;
        case "topRated":
          setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
          break;
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history(`/movie/${movieId}`);
  };
  return (
    <Slider>
      <h1>now playing</h1>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={rowVar}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={nowPlayingIndex}
        >
          {nowPlayingData?.results
            .slice(1)
            .slice(offset * nowPlayingIndex, offset * nowPlayingIndex + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                onClick={() => onBoxClicked(movie.id)}
                variants={BoxVar}
                key={movie.id}
                whileHover="hover"
                initial="normal"
                transition={{ type: "tween" }}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVar}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      <NextBtn onClick={() => increaseIndex(nowPlayingData, "nowPlaying")}>
        💨
      </NextBtn>
    </Slider>
  );
}

export default Sliders;
