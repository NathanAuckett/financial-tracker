import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import DataView from './pages/DataView';
import Accounts from './pages/Accounts';

import axios from 'axios';

import { Layout} from 'antd';
const {Header} = Layout;


async function getAccounts(accountsSetter:Function){
  await axios.get('http://localhost:3000/bank_accounts/get_bank_accounts?user_id=1', { //body gets ignored on get requests
    params: {
      user_id: 1,
      columns: JSON.stringify(["bank_account_id", "account_number", "name"])
    }
  })
  .then((response) => {
    const accounts = response.data;

    console.log(accounts);
    accountsSetter(accounts.accounts);
  })
  .catch((error) => {
    console.log(error);
  });
}



function App() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAccounts(setAccounts);
  }, []);

  return (
    <div className="App">
      <Layout>
        <Header style={{color: "white"}}>
          Header lmao
        </Header>

        <Routes>

          <Route path="/" element={<DataView accounts={accounts} />}/>
          <Route path="/accounts" element={<Accounts accounts={accounts} />}/>

        </Routes>

      </Layout>
    </div>
  );
}

export default App;
