import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotFound from './NotFound.jsx'
import MapPage from './MapPage/MapPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'  

const baseURL = '/schedule-component';

const router = createBrowserRouter([
  {path: `${baseURL}/`, element: <App/>},
  {path: `${baseURL}/map`, element: <MapPage url='https://docs.google.com/spreadsheets/d/e/2PACX-1vQEqqtCdGQFdyqlq_5c-Om7rmG24kqHTbwBUaGBlBuig_nk-sFmy3PXhfZV6QpiZGGs5ppbntozwIpW/pub?gid=480788257&single=true&output=csv' />},
  {path: '*', element: <NotFound />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
