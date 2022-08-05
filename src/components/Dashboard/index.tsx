import { useEffect, useState } from "react";
import { Summary } from "../Summary";
import { TransactionsTable } from "../TransactionsTable";
import { Container } from "./styles";

interface Transactions {
    id: number;
    title: string;
    amount: number;
    type:string;
    category:string;
    createAt: string;
}

export function Dashboard(){

    return (
        <Container>
            <Summary />
            <TransactionsTable />
        </Container>
    );
}