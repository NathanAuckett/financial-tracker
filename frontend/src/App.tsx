import React, { useEffect, useState } from 'react';
import './App.css';

import { Layout} from 'antd';

import TransactionTable from './components/TransactionTable';

import axios from 'axios';

const {Header, Content, Sider} = Layout;


function App() {
  const [transactions, setTransactions] = useState([]);

  async function getTransactions() {
    await axios.get('http://localhost:3000/transactions/get-transactions-for-user-limited?user_id=1&offset=0')
    .then((response) => {
      console.log(response.data);
      setTransactions(response.data.transactions);
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
            Left sider 
          </Sider>

          <Content>
            Content tings here aye
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
