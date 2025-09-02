import { useLocation, useNavigate } from "react-router-dom";

import DropM from "./components/DropM";

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const location = useLocation()
    const path  = location.pathname.toString() ;
    
   
    
    return (<div className="h-screen flex flex-col overflow-scroll">

            <div className="flex flex-wrap lg:flex-nowrap justify-evenly  items-center py-2 w-full h-auto lg:h-16 bg-white fixed top-0 left-0 right-0 z-50 border-b border-gray-300 px-4">

                <div className="bg-blue-600 rounded-2xl items-center justify-center flex gap-1 w-8 h-8 lg:w-12 lg:h-12 "> <div className="rounded-xl bg-white w-2 h-2  lg:h-4"></div> <div className="rounded-xl bg-white w-2 h-6 lg:h-6"></div> <div className="rounded-xl bg-white w-2 h-6 lg:h-8"> </div> </div>


                <div className="flex flex-wrap justify-center lg:justify-between items-center gap-2 lg:gap-5 mt-2 lg:mt-0">
                    <div className={`lg:text-lg text-sm font-thin ${path ==='/dashboard'?"bg-blue-400 text-white ":""} hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400`} onClick={()=>{navigate('/dashboard')}}> DashBoard </div>
                    <div className={`lg:text-lg text-sm font-thin ${path ==='/exchange'?"bg-blue-400 text-white ":""} hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400`} onClick={()=>{navigate('/exchange')}}> Exchange </div>
                    <div className={`lg:text-lg text-sm font-thin ${path ==='/transactions'?"bg-blue-400 text-white ":""} hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400`} onClick={()=>{navigate('/transactions')}}> Trades </div>
                    <div className={`lg:text-lg text-sm font-thin ${path ==='/portfolio'?"bg-blue-400 text-white ":""} hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400`} onClick={()=>{navigate('/portfolio')}}> Portfolio </div>
                </div>

                <div className="mt-2 lg:mt-0" >
                    
                    <DropM/>

                </div>
            </div>

                


            <main className="pt-15 ">{children}</main>
        </div>

    );
}
