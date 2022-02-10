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
import Poster from "../Components/Poster";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 22px;
  width: 40%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  &:nth-child(3) {
    margin-top: 60vh;
    margin-bottom: 30vw;
  }
  h1 {
    margin-bottom: 20px;
    margin-left: 20px;
    font-size: 24px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
  height: 400px;
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
  background-color: #ffffff49;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 28px;
  position: relative;
  top: -80px;
  padding: 26px;
`;

const BigOverview = styled.p`
  position: relative;
  top: -80px;
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
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

function Movie() {
  const history = useNavigate();
  const bigMovieMath = useMatch("/movie/:category/:movieId");
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
  const onBoxClicked = (movieId: number, category: string) => {
    history(`/movie/${category}/${movieId}`);
  };
  const onOverlayClick = () => history("/movie");
  // const clickedMovie =
  //   bigMovieMath?.params.movieId &&
  //   data?.results.find(
  //     (movie) => movie.id + "" === bigMovieMath.params.movieId
  //   );
  return (
    <Wrapper>
      {isNowPlayingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
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
                  .slice(
                    offset * nowPlayingIndex,
                    offset * nowPlayingIndex + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "/nowPlaying"}
                      onClick={() => onBoxClicked(movie.id, "nowPlaying")}
                      variants={BoxVar}
                      key={movie.id + "/nowPlaying"}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVar}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextBtn
              onClick={() => increaseIndex(nowPlayingData, "nowPlaying")}
            >
              💨
            </NextBtn>
          </Slider>
          <Slider>
            <h1>top rated</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVar}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topRatedIndex}
              >
                {TopRatedData?.results
                  .slice(1)
                  .slice(
                    offset * topRatedIndex,
                    offset * topRatedIndex + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "/topRated"}
                      onClick={() => onBoxClicked(movie.id, "topRated")}
                      variants={BoxVar}
                      key={movie.id + "/topRated"}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVar}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextBtn onClick={() => increaseIndex(TopRatedData, "topRated")}>
              💨
            </NextBtn>
          </Slider>
          <Slider>
            <h1>popular</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVar}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "/popular"}
                      onClick={() => onBoxClicked(movie.id, "popular")}
                      variants={BoxVar}
                      key={movie.id + "/popular"}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVar}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <NextBtn onClick={() => increaseIndex(popularData, "popular")}>
              💨
            </NextBtn>
          </Slider>

          <AnimatePresence>
            {bigMovieMath ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={`${bigMovieMath.params.movieId}/${bigMovieMath.params.category}`}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {/* {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )} */}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Movie;

// https://image.tmdb.org/t/p/original/
