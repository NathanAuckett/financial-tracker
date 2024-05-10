import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

//Pages
import DataView from './pages/DataView';
import Accounts from './pages/Accounts';
import AddTransactions from './pages/AddTransactions';
import Categories from './pages/Categories';
import Patterns from './pages/Patterns';
import CSVDictionaries from './pages/CSVDictionaries';

import axios from 'axios';

import { UserContext, AccountsContext } from './context';
import { Account } from './types';

import { Layout, Menu } from 'antd';
const {Header} = Layout;



function App() {
  const [userID, setUserID] = useState(1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAccounts(userID);
  }, [userID]);

  async function getAccounts(user_id = 1){
    await axios.get(`${process.env.REACT_APP_API_ROOT}bank_accounts/get_bank_accounts`, { //body gets ignored on get requests
      params: {
        user_id: user_id,
        columns: JSON.stringify(["bank_account_id", "account_number", "name"])
      }
    })
    .then((response) => {
      const accounts = response.data.accounts;
      console.log("Fetched Accounts", accounts);
      setAccounts(accounts);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  

  const navRoutes = [
    {
      key: 0,
      label: "Transactions",
      path: "/",
      component: <DataView/>
    },
    {
      key: 1,
      label: "CSV Dictionaries",
      path: "/csv-dictionaries",
      component: <CSVDictionaries/>
    },
    {
      key: 2,
      label: "Accounts",
      path: "/accounts",
      component: <Accounts/>
    },
    {
      key: 3,
      label: "Add Transactions",
      path: "/add-transactions",
      component: <AddTransactions/>
    },
    {
      key: 4,
      label: "Categories",
      path: "/categories",
      component: <Categories/>
    },
    {
      key: 5,
      label: "Patterns",
      path: "/patterns",
      component: <Patterns/>
    },
  ];

  function navHandleClick(target:{key:string}) {
    console.log(target);
    const route = navRoutes.find((route) => {
      return route.key.toString() === target.key
    });

    if (route){
      navigate(route.path);
    }
  }

  return (
    <div className="App">
      <Layout>
        <Header style={{display: "flex", color: "white", alignItems: "center", justifyContent: "center"}}>
          <span style={{marginRight: 50}}>Financial Tracker</span>
          <Menu
            mode='horizontal'
            items={navRoutes}
            onClick={navHandleClick}
            defaultSelectedKeys={["0"]}
          />
        </Header>
        
        <UserContext.Provider value={{userID, setUserID}}>
        <AccountsContext.Provider value={{accounts, setAccounts, getAccounts}}>
          <Routes>
            {
              navRoutes.map((route) => {
                return <Route path = {route.path} element = {route.component} />
              })
            }
          </Routes>
        </AccountsContext.Provider>
        </UserContext.Provider>
      </Layout>
    </div>
  );
}

export default App;
