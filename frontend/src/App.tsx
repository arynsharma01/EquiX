import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './layout'
import Market from './components/Market'
import StockDataCard from './components/StockDataCard'
import ChartRender from './components/ChartRender'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Signin from './components/Signin'
import TestSocket from './components/TestSocket'
import StockBuy from './components/StockBuy'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <div className="bg-gray-100  w-full min-h-screen">
        <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Layout />}> */}
          <Route  path = "/dashboard" element={<Market />} />
          <Route  path = "/stock/info" element={<StockDataCard />} />
          <Route  path = "/signup" element={<Signup />} />
          <Route  path = "/signin" element={<Signin />} />
          <Route  path = "/testsocket" element={<TestSocket />} />
          <Route  path = "/exchange" element={<StockBuy />} />

        {/* </Route> */}
        </Routes>
        </BrowserRouter>
        
        {/* <StockDataCard/> */}
        
      </div>
 

    </>
  )
}

export default App
