import {createStore,} from "redux"

import reducer from './reducer'
import {persistStore, persistReducer} from 'redux-persist';


import storage from 'redux-persist/es/storage'

const config = {
    key: 'root',
    storage,
};

export let store=createStore(persistReducer(config, reducer))
export let persistor = persistStore(store)

