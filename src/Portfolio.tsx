import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { getHoldingValue } from './utils';

interface Token {
    symbol: string;
    price: number;
}

interface PortfolioRecord {
    [token: string]: number;
};

const StyledDiv = styled.div`
    padding: 100px;
    h1 {
        text-align: center;
        margin: 100px;
    }
`;

const StyledTable = styled.table`
    border-collapse: collapse;
    width: 100%;
    th,
    td {
        padding: 10px;
        border: 1px solid black;
        text-align: right;
    }
    th {
        background-color: lightgray;
    }
    tr:nth-child(even) {
        background-color: whitesmoke;
    }
`;

const Portfolio: React.FC = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    //I am assuming that the current user's portfolio is avaiable through another api endpoint, I am hardcoding it as follows
    const hardCodedPortfolio: PortfolioRecord = { "0chain": 400, "0xcert": 2300, "ethereum": 12230, "ripple": 3230, "bitcoin": 2330, "litecoin": 630 };

    useEffect(() => {
        const fetchData = async () => {
            const csvTokens = Object.keys(hardCodedPortfolio).join(",");
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${csvTokens}&vs_currencies=usd`);
            setTokens(Object.entries(response.data).map(([symbol, item]) => ({
                symbol,
                price: (item as { usd: number }).usd
            })));
        };
        fetchData();
    }, []);

    return (
        <StyledDiv>
            <h1>Token Portfolio</h1>
            <StyledTable>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Price (USD)</th>
                        <th>Quantity</th>
                        <th>Holding (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map(token => (
                        <tr key={token.symbol}>
                            <td>{token.symbol}</td>
                            <td>${token.price.toLocaleString()}</td>
                            <td>{hardCodedPortfolio[token.symbol]}</td>
                            <td>${getHoldingValue(token.price,hardCodedPortfolio[token.symbol]).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </StyledTable>
        </StyledDiv>
    );
};

export default Portfolio;
