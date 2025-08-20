export default function Layout() {
    return <div>
        <div className="flex lg:justify-evenly justify-between items-center py-2  w-full h-16 bg-white border-b border-gray-300 ">
            <div className="flex gap-2 p-4 items-center">
                {/* <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="44" rx="12" fill="#2563EB" />
                    <rect x="12" y="24" width="4" height="12" rx="1" fill="white" />
                    <rect x="22" y="18" width="4" height="18" rx="1" fill="white" />
                    <rect x="32" y="12" width="4" height="24" rx="1" fill="white" />
                </svg> */}

                <div className="bg-blue-600 rounded-2xl  items-center justify-center flex gap-1 w-12 h-12 ">
                    
                    <div className="rounded-xl bg-white w-2 h-4"></div>
                    <div className="rounded-xl bg-white w-2 h-6"></div>
                    <div className="rounded-xl bg-white w-2 h-8">  </div>
                    
                </div>

                <div className="text-2xl font-bold">
                    EquiX
                </div>

            </div>
            <div className="flex justify-between items-center gap-5 ">
                <div className="lg:text-lg  font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md  hover:text-blue-400">
                    DashBoard
                </div>
                <div className="lg:text-lg font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md  hover:text-blue-400">
                    Exchange
                </div>
                <div className="lg:text-lg font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md  hover:text-blue-400">
                    Trades
                </div>
                <div className="lg:text-lg font-thin hover:bg-gray-100 hover:cursor-pointer p-2 text-center transition-all duration-300 rounded-md  hover:text-blue-400">
                    Portfolio
                </div>

            </div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=" text-gray-400 hover:cursor-pointer hover:text-gray-800 transition-all duration-300 size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>

            </div>
        </div>
    </div>
}