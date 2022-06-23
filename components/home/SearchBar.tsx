import { prependOnceListener } from "process";
import { useState } from "react";
const searchBar = (props) => {
  const [searchquery, setsearchquery] = useState("");
  //-------------------------------------------------//
  function handleChange(e) {
    setsearchquery(e.currentTarget.value);
  }
  //-------------------------------------------------//
    function handleSubmit(e) {
        e.preventDefault()
        props.pass_search_query_to_parent(searchquery)
    }
    //----------------------------------------------//
  return (
    <form className="form-inline searchbox">
      <input
        className="form-control mr-sm-2"
        type="search"
        placeholder="Search for article title"
        aria-label="Search"
        value={searchquery}
        onChange={(e) => handleChange(e)}
      ></input>
      <button className="btn btn-outline-success my-2 my-sm-0" onClick={(e)=>handleSubmit(e)}>
        Search
      </button>
    </form>
  );
};

export default searchBar;
