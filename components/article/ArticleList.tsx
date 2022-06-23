import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import ArticlePreview from "./ArticlePreview";
import ErrorMessage from "../common/ErrorMessage";
import LoadingSpinner from "../common/LoadingSpinner";
import Maybe from "../common/Maybe";
import Pagination from "../common/Pagination";
import { usePageState } from "../../lib/context/PageContext";
import {
  usePageCountState,
  usePageCountDispatch,
} from "../../lib/context/PageCountContext";
import useViewport from "../../lib/hooks/useViewport";
import { SERVER_BASE_URL, DEFAULT_LIMIT } from "../../lib/utils/constant";
import fetcher from "../../lib/utils/fetcher";
import { Z_STREAM_ERROR } from "zlib";
//-------------------------------------------------------------------------------------------//
const ArticleList = (props) => {
  const page = usePageState();
  const pageCount = usePageCountState();
  const setPageCount = usePageCountDispatch();
  const { vw } = useViewport();
  //----------------------------------------------------------------------------//
  const lastIndex =
    pageCount > 480 ? Math.ceil(pageCount / 20) : Math.ceil(pageCount / 20) - 1;
  //----------------------------------------------------------------------------//
  const router = useRouter();
  const { asPath, pathname, query } = router;
  //---------------------------------------------------------------------------//
  const { favorite, follow, tag, pid } = query;
  const isProfilePage =
    pathname.startsWith(`/profile`) || pathname.startsWith(`/myPosts`);
  //------------------------------------------------------------------------------//
  let fetchURL = `${SERVER_BASE_URL}/articles?offset=${page * DEFAULT_LIMIT}`;
  //------------------------------------------------------------------------------//
  switch (true) {
    case !!tag:
      fetchURL = `${SERVER_BASE_URL}/articles${asPath}&offset=${
        page * DEFAULT_LIMIT
      }`;
      break;
    case isProfilePage && !!favorite:
      fetchURL = `${SERVER_BASE_URL}/articles?favorited=${encodeURIComponent(
        String(pid)
      )}&offset=${page * DEFAULT_LIMIT}`;
      break;
    case isProfilePage && !favorite:
      fetchURL = `${SERVER_BASE_URL}/articles?author=${encodeURIComponent(
        String(pid)
      )}&offset=${page * DEFAULT_LIMIT}`;
      break;
    case !isProfilePage && !!follow:
      fetchURL = `${SERVER_BASE_URL}/articles/feed?offset=${
        page * DEFAULT_LIMIT
      }`;
      break;
    default:
      break;
  }
  //------------------------------------------------------------------------------//
  const { data, error } = useSWR(fetchURL, fetcher);

  if (error) {
    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active"></ul>
        </div>
        <ErrorMessage message="Cannot load recent articles..." />
      </div>
    );
  }
  //----------------------------------------------------------------------------//
  if (!data) {
    return <LoadingSpinner />;
  }
  //----------------------------------------------------------------------------//
  let { articles, articlesCount } = data;
  //----------------------------------------------------------------------------//
  if (articles && articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }
  //-----------------------------------------------------------------------------//
  setPageCount(articlesCount);
  //----------------------------------------------------------------------------//
  function get_filtered_article(articles) {
    if (articles.length > 0) {
      let filtered_articles = articles.filter((art) =>
        art.title.toLowerCase().includes(props.searchquery.toLowerCase())
      );
      return filtered_articles;
    } else return articles;
  }
  //---------------------------------------------------------------------------//
  if (props.searchquery !== "" && props.searchquery !== undefined) {
    // if (isProfilePage === true) {
    //   articles=get_filtered_article(articles);
    // }
    articles = get_filtered_article(articles);
    articlesCount = articles.length;
  }
  //-----------------------------------------------------------------------------//

  //----------------------------------------------------------------------------//
  return (
    <>
      {articles.length > 0 && articles ? (
        articles.map((article) => (
          <ArticlePreview key={article.slug} article={article} />
        ))
      ) : (
        <h5>No matched results found</h5>
      )}

      {articles.length > 0 && articles && (
        <Maybe test={articlesCount && articlesCount > 20}>
          <Pagination
            total={pageCount}
            limit={20}
            pageCount={vw >= 768 ? 10 : 5}
            currentPage={page}
            lastIndex={lastIndex}
            fetchURL={fetchURL}
          />
        </Maybe>
      )}
    </>
  );
};

export default ArticleList;
