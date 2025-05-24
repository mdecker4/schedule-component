import { useState } from 'react'
import './App.css'
import './SchedulePage'
import SchedulePage from './SchedulePage'


function App() {

  return (
    <>
      <SchedulePage url='https://docs.google.com/spreadsheets/d/e/2PACX-1vQEqqtCdGQFdyqlq_5c-Om7rmG24kqHTbwBUaGBlBuig_nk-sFmy3PXhfZV6QpiZGGs5ppbntozwIpW/pub?gid=945819308&single=true&output=csv' />
    </>
  )
}

export default App