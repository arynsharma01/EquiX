import { useEffect, useState } from "react";
import Input from "./Input";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

export default function Signin() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const location = useLocation()
    const [passwordMatch, setPasswordMatch] = useState<boolean>(false)
    const navigate = useNavigate()
    const [loader, setLoader] = useState<boolean>(false)
    const [response , setResponse] = useState<string>("")
    
    
    const from = location.state?.from?.pathname  ||'/dashboard'
   
    
    useEffect(()=>{
        async function signedIn() {
            try{
                  await axios.post('https://equix-k46e.onrender.com/api/already/signed',{
                    headers: {
                        token :localStorage.getItem("token")
                    }
                    
                },
            )
            
                navigate(from,{replace : true})
                
                
            }
            catch(e){
                console.log(e);
                
                console.log("not signed in ");
                
            }
            
        }
        signedIn()
    },[])
    async function userSignin() {
        setLoader(true)
        const payload = {
            
            email : email , 
            password : password 

        }
        try{
            const res = await axios.post('https://equix-k46e.onrender.com/api/user/signin', payload, {
                headers : {
                    token : localStorage.getItem("token") 
                }
            })
            
            
            setResponse(res.data.message)
            localStorage.setItem("token",res.data.token)
            setLoader(false)
            navigate(from ,{replace : true})
            
        }
        catch(e : any ){
    
            setLoader(false)
            setResponse(e.response.data.message)
        }
        
    }

    useEffect(() => {
        if ( password !== "" && email != "") {
            setPasswordMatch(true)
        }
        else {
            setPasswordMatch(false)
        }

    }, [password , email])


    return <div className="flex flex-col gap-4  items-center justify-center w-full min-h-screen ">
        <div className="flex flex-col gap-2 ">
            <div className="flex flex-col gap-4 items-center justify-center ">
                <div className="bg-blue-600 rounded-2xl  items-center justify-center flex gap-1 w-16 h-16 ">

                    <div className="rounded-xl bg-white w-2 h-5"></div>
                    <div className="rounded-xl bg-white w-2 h-8"></div>
                    <div className="rounded-xl bg-white w-2 h-10">  </div>

                </div>
                <div className="text-4xl font-bold text-center ">
                    EquiX
                </div>
            </div>

            <div className="text-xl font-semibold text-gray-700">
                Welcome back to your trading dashboard
            </div>

        </div>
        <div className="flex gap-4  flex-col border border-gray-300 shadow-md shadow-blue-200  bg-white rounded-2xl px-6 py-8  ">
            <div className="gap-2">
                <div className="text-2xl font-semibold">
                    Sign In 

                </div>
                <div className="font-semibold text-sm text-gray-500">
                    Welcome Back ! Access your portfolio and start trading  
                </div>
            </div>

            <div>
                
                <Input heading="Email " placeholder="Enter your email " type="string" onChange={setEmail} />
                <Input heading="Password " placeholder="Enter your password  " type="password" onChange={setPassword} />
                
            </div>

            {loader?(<div className=" flex justify-center items-center w-full text-blue-500">
                <ScaleLoader color="#3657e5"  />
            </div>):(<button
            onClick={()=>{
                userSignin()
            }}
            className={` ${passwordMatch ? "cursor-pointer hover:bg-[#253ceb] bg-[#2563EB] " : "pointer-events-none cursor-not-allowed  bg-blue-400"}  text-white transition-all  duration-300 p-3 rounded-2xl`}>{ }Sign in </button>)}
            <div className="text-gray-600 flex gap-2 justify-center text-lg ">
                Don't have an account?
                <div className="hover:underline hover:text-blue-500 text-blue-400 hover:cursor-pointer transition-all duration-300 " onClick={()=>{navigate('/signup',{replace: true})}}>
                    Signup
                </div>
            </div>
            <div className="text-red-400 test-sm text-center max-w-sm">
                {response}
            </div>
        
        </div>
        <div className="flex items-center justify-between gap-2 ">
            <div className="flex flex-col justify-center items-center  bg-white p-4 gap-2 border border-gray-300 rounded-2xl " >
                <div className="p-2 bg-green-300  items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-6 text-gray-700 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                </div>
                <div className="text-sm text-gray-700">
                    Real Time Charts
                </div>

            </div>
            <div className="flex flex-col justify-center items-center  bg-white p-4 gap-2 border border-gray-300 rounded-2xl " >
                <div className="p-2 bg-blue-300  items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-6 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>

                </div>
                <div className="text-sm text-gray-700">
                    Portfolio Tracking 
                </div>

            </div>
            <div className="flex flex-col justify-center items-center  bg-white p-4 gap-2 border border-gray-300 rounded-2xl " >
                <div className="p-2 bg-purple-300  items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="size-6 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                    </svg>

                </div>
                <div className="text-sm text-gray-700">
                   Instant Trading 
                </div>

            </div>

        </div>
    </div>
}