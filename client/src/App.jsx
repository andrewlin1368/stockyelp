import { useGetAllStocksQuery } from "./api/stocksApi";
import Stocks from "./components/Stocks";

function App() {
  const { isLoading } = useGetAllStocksQuery();
  return <>{(isLoading && <>Loading...</>) || <Stocks></Stocks>}</>;
}

export default App;
