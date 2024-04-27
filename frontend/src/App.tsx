import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

//Pages
import DataView from './pages/DataView';
import Accounts from './pages/Accounts';
import AddTransactions from './pages/AddTransactions';
import Categories from './pages/Categories';
import Patterns from './pages/Patterns';
import CSVDictionaries from './pages/CSVDictionaries';

import axios from 'axios';

import { Layout} from 'antd';
const {Header} = Layout;

interface UserContextType {
  userID?: number,
  setUserID?: Function
}
export const UserContext = React.createContext<UserContextType>({});

async function getAccounts(accountsSetter:Function, user_id = 1){
  await axios.get('http://localhost:3000/bank_accounts/get_bank_accounts', { //body gets ignored on get requests
    params: {
      user_id: user_id,
      columns: JSON.stringify(["bank_account_id", "account_number", "name"])
    }
  })
  .then((response) => {
    const accounts = response.data.accounts;
    console.log("Fetched Accounts", accounts);
    accountsSetter(accounts);
  })
  .catch((error) => {
    console.log(error);
  });
}


function App() {
  const [userID, setUserID] = useState(1);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAccounts(setAccounts, userID);
  }, [userID]);

  return (
    <div className="App">
      <Layout>
        <Header style={{color: "white"}}>
          Financial Tracker
        </Header>
        
        <UserContext.Provider value={{userID, setUserID}}>
          <Routes>

            <Route path="/" element={<DataView accounts={accounts} />} />
            <Route path="/accounts" element={<Accounts accounts={accounts} />} />
            <Route path="/add-transactions" element={<AddTransactions/>} />
            <Route path="/categories" element={<Categories/>} />
            <Route path="/patterns" element={<Patterns/>} />
            <Route path="/csv-dictionaries" element={<CSVDictionaries/>} />

          </Routes>
        </UserContext.Provider>
      </Layout>
    </div>
  );
}

export default App;
