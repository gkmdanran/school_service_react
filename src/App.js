import React, { memo ,Suspense} from 'react'
import {Provider} from 'react-redux';
import {renderRoutes} from 'react-router-config'
import { HashRouter } from 'react-router-dom'
import routes from './router'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/es/integration/react'
import Loading from "./pages/Loading"
export default memo(function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <HashRouter>
            <Suspense fallback={<Loading></Loading>}>
              {renderRoutes(routes)}
            </Suspense>
          </HashRouter>
        </PersistGate>
      </Provider>
    </div>
  )
})

