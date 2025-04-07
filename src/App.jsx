import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './SchedulePage'
import SchedulePage from './SchedulePage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SchedulePage url='https://docs.google.com/spreadsheets/d/e/2PACX-1vQEqqtCdGQFdyqlq_5c-Om7rmG24kqHTbwBUaGBlBuig_nk-sFmy3PXhfZV6QpiZGGs5ppbntozwIpW/pub?gid=945819308&single=true&output=csv' />
    </>
  )
}

export default App

// async function fetchCSVAsText(url, setSchedule) {
//   console.log('Here');
//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//     const csvText = await response.text();
//     return csvText;
//   } catch (error) {
//     console.error("Failed to fetch CSV:", error);
//     return null;
//   }
// }

// async function getScheduleFile(){
//   const file = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQEqqtCdGQFdyqlq_5c-Om7rmG24kqHTbwBUaGBlBuig_nk-sFmy3PXhfZV6QpiZGGs5ppbntozwIpW/pub?gid=945819308&single=true&output=csv');
//   return file;
// }

// function parseCSV(file){
//   if(!file || !FileReader)
//   {
//     return <>File or reader not found</>
//   }
  
//   var reader = new FileReader()

//   reader.onload = function(e) {

//   };

//   reader.readAsText(file);

//   return file;
// }
