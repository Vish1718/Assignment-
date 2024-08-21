import React, { useEffect, useState } from "react";
import "./CollegeTable.css";
import collegesData from "./colleges.json";
import { GoDotFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaRegSquare } from "react-icons/fa6";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [displayedColleges, setDisplayedColleges] = useState(20); // Starting with 10 items
  const [sortConfig, setSortConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setColleges(collegesData);
    console.log(colleges.length);
    console.log(colleges);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (sortConfig !== null) {
      let sortedColleges;
      if (sortConfig.key === "ranking") {
        sortedColleges = sortByRanking(colleges, sortConfig.direction);
      } else {
        sortedColleges = [...colleges].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key])
            return sortConfig.direction === "asc" ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key])
            return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }
      setColleges(sortedColleges);
    }
  }, [sortConfig]);

  function sortByRanking(colleges, direction) {
    return colleges.sort((a, b) => {
      const rankA = extractRankingNumber(a.ranking);
      const rankB = extractRankingNumber(b.ranking);
      if (rankA < rankB) return direction === "asc" ? -1 : 1;
      if (rankA > rankB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  function extractRankingNumber(ranking) {
    // Match the numeric part of the ranking before any non-numeric characters
    const match = ranking.match(/^\d+/);
    return match ? parseInt(match[0], 10) : Infinity; // Return Infinity if no number is found
  }

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight
    ) {
      setDisplayedColleges((prevCount) =>
        Math.max(prevCount + 10, colleges.length)
      );
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setColleges(collegesData);
    } else {
      const filteredColleges = collegesData.filter((college) =>
        college.name.toLowerCase().includes(value)
      );
      setColleges(filteredColleges);
      //   setDisplayedColleges(10);
    }
  };

  const formatRanking = (ranking) => {
    // Split the ranking string at the '/'
    const [position, total] = ranking.split("/");

    // Extract the starting number (e.g., '3rd')
    const startingNumber = position.trim();

    // Extract the total number (e.g., '131 in India')
    const totalNumber = total.split(" ")[0].trim();

    return (
      <>
        <span className="ranking-position">{startingNumber}</span> /
        <span className="ranking-total"> {totalNumber}</span> in India
      </>
    );
  };

  return (
    <div className="container" >
      <input
        type="text"
        placeholder="Search by college name"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <table className="college-table">
        <thead>
          <tr>
            <th onClick={() => requestSort("id")}>CD Rank</th>
            <th onClick={() => requestSort("name")}>Colleges</th>
            <th onClick={() => requestSort("fees")}>Course Fees</th>
            <th onClick={() => requestSort("averagePackage")}>Placement</th>
            <th onClick={() => requestSort("userReviews")}>User Reviews</th>
            <th onClick={() => requestSort("ranking")}>Ranking</th>
          </tr>
        </thead>
        <tbody>
          {colleges.slice(0, displayedColleges).map((college) => (
            <tr key={college.id}>
              <td>#{college.id}</td>
              <td className="college-name">
                {college.featured && <span className="featured">Featured</span>}
                {college.name}

                <div className="bottom">
                  <div className="first">
                    {" "}
                    <FaArrowRight /> Apply Now
                  </div>
                  <div className="second">
                    {" "}
                    <MdOutlineFileDownload /> Download Brochure
                  </div>
                  <div className="third">
                    {" "}
                    <FaRegSquare /> Add To Compare
                  </div>
                </div>
              </td>
              <td>
                ₹ {college.fees.toLocaleString()}
                <div className="fee-bottom">
                  <div className="fee-first">BE/B.Tech</div>
                  <div className="fee-second">- 1st Year Fees</div>
                  <div className="fee-third">
                    {" "}
                    <MdOutlineSwapHoriz /> Compare Fees{" "}
                  </div>
                </div>
              </td>

              <td>
                ₹ {college.averagePackage.toLocaleString()}
                <div className="fee-bottom">
                  <div className="fee-first"> Average package</div>
                  <div className="high-package">
                    {" "}
                    {college.highestPackage.toLocaleString()}
                  </div>
                  <div className="fee-second"> Highest package</div>
                  <div className="fee-third">
                    {" "}
                    <MdOutlineSwapHoriz /> Compare Fees{" "}
                  </div>
                </div>
              </td>

              <td>
                <GoDotFill color="orange" /> {college.userReviews} / 10
                <div className="review">
                  <div className="review-first">Best On 265 User Reviews</div>
                  <div className="review-second">
                    <div className="tick">
                      <IoMdCheckmark />
                    </div>
                    <div className="text">Best In Social Life</div>
                    <div className="youTick">
                      <FaAngleDown />
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {formatRanking(college.ranking)}
                <div className="rank-first">
                  <img className="rank-image" src="/newsweek.png" />
                  2023
                </div>
              </td>
              {/*    {<td>{college.ranking}</td>} */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeTable;
