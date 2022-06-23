import Head from "next/head";
import React, { Fragment,useState } from "react";

import Banner from "../../components/home/Banner";
import SearchBar from "../../components/home/SearchBar";
import MainView from "../../components/home/MainView";
import Tags from "../../components/home/Tags";

const Home = () => {
  const [searchquery, set_search_query] = useState("");
  //--------------------------------------------------//
  function get_search_query_from_child(input) {
    set_search_query(input);
  }
  //--------------------------------------------------//
  return (
    <Fragment>
      <Head>
        <title>HOME | NEXT REALWORLD</title>
        <meta
          name="description"
          content="Next.js + SWR codebase containing realworld examples (CRUD, auth, advanced patterns, etc) that adheres to the realworld spec and API"
        />
      </Head>
      <div className="home-page">
        <Banner />
        <SearchBar pass_search_query_to_parent={get_search_query_from_child} />
        <div className="container page">
          <div className="row">
            <MainView searchquery={searchquery} />
            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <Tags />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
