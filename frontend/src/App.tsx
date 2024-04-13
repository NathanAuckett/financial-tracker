import React, { useEffect, useState } from 'react';
import './App.css';

import { Layout, Dropdown} from 'antd';

import TransactionTable from './components/TransactionTable';
import Chart from './components/Chart';
import AccountDropDown from './components/AccountDropDown';

import axios from 'axios';

const {Header, Content, Sider} = Layout;

function transactionsConcatCategoryNames(transactionData: object[]){
  type transaction = {
    categories:object[],
    categoryNamesConcat:string
    accountNumber:string,
    accountName:string
    bank_account:{account_number:string, name:string}
  }

  type category = {
    name:string
  }

  type account = {
    account_number:string,
    name:string
  }

  const transactions = transactionData as unknown as transaction[];

  transactions.forEach((transaction) => {
    transaction.categoryNamesConcat = "";
    transaction.accountNumber = transaction.bank_account.account_number;
    transaction.accountName = transaction.bank_account.name;

    const categories = transaction.categories as category[];

    categories.forEach((category) => {
      if (transaction.categoryNamesConcat !== ""){
        transaction.categoryNamesConcat += ", ";
      }

      transaction.categoryNamesConcat += category.name;
    });
  });
}

function App() {
  const [transactions, setTransactions] = useState([]);

  async function getTransactions() {
    await axios.get('http://localhost:3000/transactions/get-transactions-for-user-limited?user_id=1&offset=0', {
      params:{
        user_id: 1,
        account_id: null,
        limit: null,
        offset: null,
        category_ids: null
      }
    })
    .then((response) => {
      const transactions = response.data.transactions;
      
      transactionsConcatCategoryNames(transactions);

      console.log(transactions);
      setTransactions(transactions);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className="App">
      
      <Layout>
        <Header style={{color: "white"}}>
          Header lmao
        </Header>

        <Layout>

          <Sider style={{color: "white"}}>

            <AccountDropDown/>

          </Sider>

          <Content>
            <Chart data={transactions}/>
          </Content>

          <Sider style={{color: "white"}}>
            Right sider
          </Sider>
        </Layout>

        <div className='TableContainer'>
          <TransactionTable data={transactions}/>
        </div>

      </Layout>

    </div>
  );
}

export default App;
