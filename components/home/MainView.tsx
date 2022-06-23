import React from "react";

import TabList from "./TabList";
import ArticleList from "../article/ArticleList";

const MainView = (props) => (
  <div className="col-md-9">
    <div className="feed-toggle">
      <TabList />
    </div>
    <ArticleList searchquery={props.searchquery} />
  </div>
);

export default MainView;
