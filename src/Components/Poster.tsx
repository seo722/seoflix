import { motion } from "framer-motion";
import styled from "styled-components";
import { IGetMoviesResult, IGetTvShows, IMovie } from "../api";
import { makeImagePath } from "../utils";

const Image = styled.img`
  object-fit: cover;
  object-position: top center;
  width: 100%;
  pointer-events: none;
`;

const InfoContainer = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px 5px;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;

  h3 {
    font-size: 14px;
    margin-bottom: 0.3em;
  }

  ul {
    display: flex;
    font-size: 12px;
    span {
      color: rgba(255, 255, 255, 0.6);
    }
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
  },
};

function Poster<ItemTypes extends IGetMoviesResult | IGetTvShows>({
  data,
}: {
  data: ItemTypes;
}) {
  const type = Object.keys(data).includes("title")
    ? "movie"
    : Object.keys(data).includes("name")
    ? "tv"
    : "person";
  const Data = data as unknown as IMovie;
  return (
    <>
      {type === "movie" ? (
        <>
          <Image
            src={makeImagePath(Data.poster_path, "w300")}
            alt={Data.title}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = "/images/ready.jpeg";
            }}
          />
          <InfoContainer variants={infoVariants}>
            <h3>{Data.title}</h3>
          </InfoContainer>
        </>
      ) : null}
    </>
  );
}

export default Poster;
