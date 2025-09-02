import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function DropM() {
  const [email, setEmail] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // 👇 Check if cookie/session is valid
    axios
      .get("https://equix-k46e.onrender.com/api/already/signed", { withCredentials: true })
      .then((res) => {
        
        
        setEmail(res.data.email) // backend should return email if logged in
      })
      .catch(() => {
        setEmail(null) // not logged in
      })
  }, [])

  const handleLogout = async () => {
    await axios.post("https://equix-k46e.onrender.com/api/auth/logout", {}, { withCredentials: true })
    setEmail(null)
    navigate("/signin") 
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        {email && <DropdownMenuLabel>{email}</DropdownMenuLabel>}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <a href="https://www.linkedin.com/in/aryan-sharma-36192724b/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <a href="https://github.com/arynsharma01" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          
          <a href="mailto:aryansharma6779@gmail.com">aryansharma6779@gmail.com</a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {email ? (
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate("/signin")}>Sign in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
