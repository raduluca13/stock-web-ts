import React from 'react'
import { createStore } from './StocksStore/StockStore/StocksStore'

const storesContext = React.createContext({
    stocksStore: createStore()
})

export default storesContext