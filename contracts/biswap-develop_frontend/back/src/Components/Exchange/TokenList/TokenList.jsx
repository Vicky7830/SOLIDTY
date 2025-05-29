import { useCallback, useEffect, useState } from "react";
import as from "./TokenList.module.css";
import { MdClose } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { useSelector } from "react-redux";

const TokenList = ({
  TokenListVisHandler,
  setSelectedTokenSecond,
  setSelectedTokenFirst,
  selectedTokenFirst,
}) => {
  // token list data
  const listedToken = useSelector(
    (state) => state.listedTokenSlice.listedTokens
  );

  const [filteredToken, setFilteredToken] = useState(listedToken);
  const [searchedTerm, setSearchedTerm] = useState("");

  //update searched term in state
  const handleSetSearchedTerm = useCallback(
    ({ target: { value } }) => {
      setSearchedTerm(value);
    },
    [searchedTerm]
  );

  //update selected token
  const updateSelectedToken = (token) => {
    if (!selectedTokenFirst) {
      setSelectedTokenFirst(token);
    } else {
      setSelectedTokenSecond(token);
    }
    TokenListVisHandler();
  };

  //search from token list
  const filterToken = () => {
    setFilteredToken(() => {
      return listedToken.filter((item) => {
        if (
          item.name.toLowerCase().includes(searchedTerm.toLocaleLowerCase()) ||
          item?.platform?.token_address === searchedTerm
        ) {
          return item;
        }
      });
    });
  };

  //call when user enter anything in search box
  useEffect(() => {
    if (searchedTerm) filterToken();
    else setFilteredToken(listedToken);
  }, [searchedTerm]);

  return (
    <div
      className={`${as.TokenListCont} d-flex justify-content-center align-items-start`}
    >
      {/* <div className={`${as.darkBackground}`}  > </div> */}

      {/* token list container  */}
      <div className={`${as.TokenListBox} d-flex flex-column gap-3`}>
        <div className={`${as.popupHeader} `}>
          <h4 className="fw-bold">Select a token</h4>
          <h1 className="cursor-pointer">
            <MdClose
              className="fw-bold cursor-pointer"
              onClick={TokenListVisHandler}
            />
          </h1>
        </div>

        {/* search tokens  input  */}
        <div className={as.coinSearchDiv}>
          <input
            type="text"
            placeholder="Searach name or paste address"
            onChange={handleSetSearchedTerm}
          ></input>
          <span className="cursor-pointer">
            <IoIosSearch></IoIosSearch>
          </span>
        </div>

        {/* token name list  */}
        <div className={`${as.coinListDiv} `}>
          {/* head  */}
          <h6>Token name</h6>

          {/* list  */}
          <ul>
            {filteredToken?.map((data) => {
              return (
                <li key={data.id} onClick={() => updateSelectedToken(data)}>
                  <img src={data.logo}></img>
                  <span>{data.symbol}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenList;
