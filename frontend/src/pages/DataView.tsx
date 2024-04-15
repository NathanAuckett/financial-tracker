import { FC, useEffect, useState } from 'react';

import TransactionTable from '../components/TransactionTable';
import Chart from '../components/Chart';
import AccountDropDown from '../components/AccountDropDown';

import axios from 'axios';

import { Layout } from 'antd';
const {Content, Sider} = Layout;

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

async function getTransactions(transactionsSetter:Function, user_id = 1, bank_account_id = 1) {
  await axios.get('http://localhost:3000/transactions/get-transactions-for-user-limited', {
    params:{
      user_id: user_id,
      bank_account_id: bank_account_id,
      limit: null,
      offset: null,
      category_ids: null
    }
  })
  .then((response) => {
    const transactions = response.data.transactions;
    
    transactionsConcatCategoryNames(transactions);

    console.log(transactions);
    transactionsSetter(transactions);
  })
  .catch((error) => {
    console.log(error);
  });
}

interface props {
    accounts:object[]
}

const DataView:FC<props> = (props) => {
    
    const [transactions, setTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(1);

    const { accounts } = props;

    useEffect(() => {
        getTransactions(setTransactions, 1, selectedAccount);
    }, []);

    return (
        <>
            <Layout>
                <Sider style={{color: "white"}}>

                    <AccountDropDown
                    accounts={accounts}
                    getTransactions={getTransactions}
                    setTransactions={setTransactions}
                    setSelectedAccount={setSelectedAccount}
                    />

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
        </>
    )
}


export default DataView;