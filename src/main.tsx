import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'rsuite/dist/rsuite.min.css';
import {store} from "./redux/store.ts";
import {Provider} from "react-redux";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <App/>
        </StrictMode>
    </Provider>
)
