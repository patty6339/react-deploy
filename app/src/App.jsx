import { useState } from 'react'
import './App.css'

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

function getTime(){
  return new Date().toLocaleTimeString();
}
function App() {
  const [count, setCount] = useState(0)
  const [currentDate, setCurrentDate] = useState(getDate())
  const [currentTime, setCurrentTime] = useState(getTime());
  

  return (
    <>
      <div className='container'>
      
      <h1>AWS HANDS ON PROJECT ON CICD PIPELINE</h1>

      <div className="card">
      <div>
            <h2>Live Time</h2>
            <p className="text-xl">{currentTime}</p>
          </div>
          
          <div>
            <h2>Today's Date</h2>
            <p className="text-xl">{currentDate}</p>
          </div>

          <p>
              Hands-on demo successfuly completed following directions from previous class.
          </p>
          </div>
        
      </div>
      

    </>
  )
}

export default App
