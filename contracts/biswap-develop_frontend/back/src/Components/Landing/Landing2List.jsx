import React, { useEffect, useMemo, useState } from "react";
import as from "./Landing2.module.css";
import Logo from "../../assets/coin1.png"; // Logo
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useGetTopTokenListMutation } from "../../services/api/tokenListing";
import { useDispatch, useSelector } from "react-redux";
import { setTokenList } from "../../services/slice/topCoinsSlice";
import "./Style.css"; // Custom CSS

// import { btcb_, volume_ } from '../../App';
// cellRenderer
const SimpleComp = (p) => {
  return (
    <>
      {" "}
      <img style={{ width: "1rem" }} src={p.value}></img>
    </>
  );
};

const Landing2 = () => {

  const [rowData, setRowData] = useState([]);

  const [colDefs, setColDefs] = useState([
    // { , field: "Name" },
    // { field : "Name"  },
    { field: "#",width:"60"  },
    { field: " ", cellRenderer: SimpleComp,width:"70"},
    { field: "Coin",width:"180" }, //change field value as your header value
    // { cellRenderer: SimpleComp , field: "firstName" },  //change field value as your header value
    { field: "Price",width:"250" }, //change field value as your header value
    { field: "24h",width:"250" }, //change field value as your header value
    { field: "Market Cap",width:"400" }, //change field value as your header value
  ]);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const tokenList = useSelector(
    (state) => state.TopCoinsSlice.top100_CoinsList
  );

  const defaultColDef = useMemo(() => ({
    resizable: true,
    // flex: 1,
  }));

  const dispatch = useDispatch();
  const gridOptions = {
    sortable:true,
    pagination: true,
    paginationAutoPageSize : true
    ,
    paginationPageSize: 10,
  

    onPaginationChanged: (event) => {
      setPageNumber(event.api.paginationGetCurrentPage() + 1);
      setPageSize(event.api.paginationGetPageSize());
    },
  };

  const [getTopTokenList, { }] = useGetTopTokenListMutation();

  const fetchListHandler = async () => {
    try {
      const { data } = await getTopTokenList();
      if (data.length) {
        dispatch(setTokenList(data));
        handleRowData(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleRowData();
  }, [pageNumber, pageSize]);

  const handleRowData = (data = tokenList) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);

    setRowData(() => {
      return currentData?.map((item) => {
        const {
          market_cap_rank = 0,
          name = "",
          current_price = 0,
          high_24h = 0,
          market_cap = 0,
          image = "",
        } = item;
        return {
          "#": market_cap_rank,
          " ": image,
          Coin: name,
          Price: parseInt(current_price).toFixed(2),
          "24h": parseInt(high_24h).toFixed(2),
          "Market Cap": parseInt(market_cap).toFixed(2),
        };
      });
    });
  };

  useEffect(() => {
    if (tokenList.length < 1) fetchListHandler();
  }, []);

  return (
    // Container
<div  className={`${as.divLand2Cont} `}  >

  <h4 className={`${as.ourSwap} text-uppercase`}   >BUY & SELL </h4>



<div className={`${as.Landing2Cont} `}>


<div id="LivePrice" class="containerR">

					<div class="headerR">
					  {/* <img src={Logo} alt="Logo" class="logo1" /> */}
               <p className="sub-txt">
        Buy and sell Sikka Coin, and other digital assets securely using bank transfers. Experience fast, reliable trading and staking on a trusted exchange platform.
      </p>
					   
					</div>
			   <div className="iframe-container">
        <iframe
          src="https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0xCCa556AecF1e8F368628c7543c382303887265eD"
          title="Sikka Swap"
          width="100%"
          height="500"
          allowFullScreen
        ></iframe>
      </div>
				</div>
        
				      


</div>
</div>
  );
};

export default Landing2;
