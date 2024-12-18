import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {store} from "./redux/store.ts";
import {Provider} from "react-redux";
import 'rsuite/dist/rsuite.min.css';
createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <App/>
        </StrictMode>
    </Provider>
)
