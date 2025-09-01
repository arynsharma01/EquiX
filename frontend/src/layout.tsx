import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    return (<div className="h-screen flex flex-col overflow-scroll">

            <div className="flex flex-wrap lg:flex-nowrap justify-evenly  items-center py-2 w-full h-auto lg:h-16 bg-white fixed top-0 left-0 right-0 z-50 border-b border-gray-300 px-4">

                <div className="bg-blue-600 rounded-2xl items-center justify-center flex gap-1 w-12 h-12 "> <div className="rounded-xl bg-white w-2 h-4"></div> <div className="rounded-xl bg-white w-2 h-6"></div> <div className="rounded-xl bg-white w-2 h-8"> </div> </div>


                <div className="flex flex-wrap justify-center lg:justify-between items-center gap-2 lg:gap-5 mt-2 lg:mt-0">
                    <div className="lg:text-lg text-sm font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400" onClick={()=>{navigate('/dashboard')}}> DashBoard </div>
                    <div className="lg:text-lg text-sm font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400" onClick={()=>{navigate('/exchange')}}> Exchange </div>
                    <div className="lg:text-lg text-sm font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400" onClick={()=>{navigate('/transactions')}}> Trades </div>
                    <div className="lg:text-lg text-sm font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md hover:text-blue-400" onClick={()=>{navigate('/portfolio')}}> Portfolio </div>
                </div>

                <div className="mt-2 lg:mt-0">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="text-gray-400 hover:cursor-pointer hover:text-gray-800 transition-all duration-300 size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                    </svg>
                </div>
            </div>

                


            <main className="pt-15 ">{children}</main>
        </div>

    );
}
