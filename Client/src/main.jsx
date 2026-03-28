import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import QueryProvider from './query/QueryProvider.jsx'
import ContextProvider from './context/ContextProvider.jsx'
import {BrowserRouter} from 'react-router-dom'
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
         <ContextProvider>
            <App />
          </ContextProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
