import React from 'react'
import { createStore, TStore } from '../stores/StocksStore/StockStore/StocksStore'
import storeContext from '../stores/StoresContext'

const useStore = () => {
    const store = React.useContext(storeContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.')
    }

    return store
}

export default useStore