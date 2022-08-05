import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { api } from '../services/api';


interface TransactionsContextData {
    transactionsData : Transaction[];
    createTransaction:(transaction: TransactionInput) => Promise<void>;
}


interface Transaction {
    id: number;
    title: string;
    amount: number;
    type:string;
    category:string;
    createdAt: string;
}

interface TransactionsProviderProps {
    children: ReactNode;
}


//forma 1
// interface TransactionInput {
//     title: string;
//     amount: number;
//     type:string;
//     category:string;
// }

//forma2
//herda todos os campos da interface Transaction utilizando apenas os campos abaixo informados
//type TransactionInput =  Pick<Transaction,'title' | 'amount' |'type'| 'category'>;

//forma3
//herda todos os campos da interface Transaction omitindo os campos abaixo informados
type TransactionInput =  Omit<Transaction,'id' | 'createdAt'>;

const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactionsData, setTransactionsData] =  useState<Transaction[]>([]);

    useEffect(()=>{
        api.get('/transactions')
            .then(response=> {
                if(!!response.data) {
                    setTransactionsData(response.data.transactions);
                }
            })
            .catch(error=> console.log(error))
    },[]);


    async function createTransaction(transactionInput:TransactionInput){
        const response = await api.post('/transactions',{
            ...transactionInput,
            createdAt : new Date(),
        });
        const { transaction } = response.data;

        setTransactionsData([
            ...transactionsData,
            transaction
        ])
    }

    return (
        <TransactionsContext.Provider value={{transactionsData,createTransaction}}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext);
    
    return context;
}