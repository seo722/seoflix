import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getTvShows, IGetMoviesResult, MultiSearch, multiSearch } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  padding: 110px 10px 0;
  background-color: rosybrown;
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 10px;
  padding: 30px 60px;
`;

const Item = styled.div`
  img {
    width: 100%;
    border-radius: 5px;
  }
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const Title = styled.span`
  position: absolute;
  bottom: 0;
  text-align: center;
  z-index: 21;
  width: 100%;
  padding: 5px 0px;
  background-color: rgba(0, 0, 0, 0.3);
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["search", keyword],
    () => multiSearch(keyword)
  );
  return (
    <Wrapper>
      <Items>
        {data?.results.map((item) => (
          <Item>
            <img src={makeImagePath(item.poster_path)} alt={item.title} />
            <Title>{item.title ?? "앗 제목을 빠트렸나봐요!"}</Title>
          </Item>
        ))}
      </Items>
    </Wrapper>
  );
}

export default Search;
