import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App my_passed_as_arg_expression="Gustapa" />  
  </StrictMode>,
)


// <App /> is rendered inside a special <React.StrictMode> component. 
// This component helps developers catch potential problems in their code.