import React, { memo ,Suspense} from 'react'
import {Provider} from 'react-redux';
import {renderRoutes} from 'react-router-config'
import { HashRouter } from 'react-router-dom'
import routes from './router'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/es/integration/react'
export default memo(function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <HashRouter>
            <Suspense fallback={<div> page loading</div>}>
              {renderRoutes(routes)}
            </Suspense>
          </HashRouter>
        </PersistGate>
      </Provider>
    </div>
  )
})

