import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

//Pages
import DataView from './pages/DataView';
import Accounts from './pages/Accounts';
import AddTransactions from './pages/AddTransactions';
import Categories from './pages/Categories';
import PatternGroups from './pages/PatternGroups';
import CSVFormats from './pages/CSVFormats';

import axios from 'axios';

import { UserContext, AccountsContext, MessageContext } from './context';
import { Account } from './types';

import { Layout, Menu, message } from 'antd';
import { NoticeType } from 'antd/es/message/interface';
const {Header} = Layout;



function App() {
  const [userID, setUserID] = useState(1);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    getAccounts(userID);
  }, [userID]);

  function showMessage(type: NoticeType, content: string) {
    messageApi.open({
        type: type,
        content: content,
        style: {
            marginTop: "8vh"
        }
    });
}

  async function getAccounts(user_id = 1){
    await axios.get(`${process.env.REACT_APP_API_ROOT}bank-accounts/get-bank-accounts`, { //body gets ignored on get requests
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
      label: "CSV Formats",
      path: "/csv-formats",
      component: <CSVFormats/>
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
      component: <PatternGroups/>
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
      {messageContextHolder}
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
        
        <MessageContext.Provider value={{showMessage}}>
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
        </MessageContext.Provider>
      </Layout>
    </div>
  );
}

export default App;
