import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// The layout decides where each route lands — top of page, or an anchor a
// redirect pointed at. Left on 'auto', the browser restores its own remembered
// position on reload and overrides that decision.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
