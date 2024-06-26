import { FC, useEffect, useState, useContext } from 'react';

import TransactionTable from '../components/TransactionTable';
import Chart from '../components/Chart';
import AccountDropDown from '../components/AccountDropDown';

import axios from 'axios';

import { AccountsContext, UserContext } from '../context';

import { Layout } from 'antd';
import { Account } from '../types';
const {Content, Sider} = Layout;



function transactionsConcatCategoryNames(transactionData: object[]): void{
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
  await axios.get(`${process.env.REACT_APP_API_ROOT}transactions/get-transactions`, {
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
    console.log("Transactions: ", transactions);
    
    if (transactions.length > 0){
      transactionsConcatCategoryNames(transactions);
    }
    
    transactionsSetter(transactions);
  })
  .catch((error) => {
    console.log(error);
  });
}

interface props {
    //accounts:Account[]
}
const DataView:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const { accounts } = useContext(AccountsContext);
    const [transactions, setTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(1);

    //const { accounts } = props;

    useEffect(() => {
        if (accounts && accounts.length > 0){
          const found = accounts.find((e) => {
            return e.bank_account_id == selectedAccount
          });

          if (!found){
            setSelectedAccount(accounts[0].bank_account_id);
          }
        }
        getTransactions(setTransactions, userID, selectedAccount);
    }, [userID, selectedAccount, accounts]);

    return (
        <>
          <Layout>
              <Sider style={{padding: 10}} width="max-content">
                  <AccountDropDown
                    accounts={accounts}
                    selectedAccount={selectedAccount}
                    setSelectedAccount={setSelectedAccount}
                  />
              </Sider>

              <Content>
                  <Chart data={transactions}/>
              </Content>

              <Sider style={{padding: 10, color: "white"}}>
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