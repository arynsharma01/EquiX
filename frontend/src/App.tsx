import { useState } from 'react'

import './App.css'
import Layout from './layout'
import Market from './components/Market'
import StockDataCard from './components/StockDataCard'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Signin from './components/Signin'
import TestSocket from './components/TestSocket'
import StockBuy from './components/StockBuy'
import Transactions from './components/Transactions'
import Portfolio from './components/Portfolio'



function App() {
  

  return (
    <>

      <div className="bg-gray-200  w-full min-h-screen">
        <BrowserRouter>
        <Layout>
        <Routes>
          {/* <Route path="/" element={<Layout />}> */}
          <Route  path = "/dashboard" element={<Market />} />
          <Route  path = "/stock/info" element={<StockDataCard />} />
          <Route  path = "/signup" element={<Signup />} />
          <Route  path = "/signin" element={<Signin />} />
          <Route  path = "/testsocket" element={<TestSocket />} />
          <Route  path = "/exchange" element={<StockBuy />} />
          <Route  path = "/transactions" element={<Transactions />} />
          <Route  path = "/portfolio" element={<Portfolio />} />

        {/* </Route> */}
        </Routes>
        </Layout>
        </BrowserRouter>
        
        {/* <StockDataCard/> */}
        
      </div>
 

    </>
  )
}

export default App
