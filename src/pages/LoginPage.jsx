import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import api from "../services/api"
import Cookies from "js-cookie"
import useUserStore from "../context/userStore"
import kriyaats from "../assets/kriyaats.png"

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const {
        data: { token },
      } = await api.post("/auth/login", {
        user_email: email,
        user_password: password,
      })

      Cookies.set("token", token, { expires: rememberMe ? 7 : 1 })

      const { data: userInfo } = await api.get("/user/getuserinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUser(userInfo)
      navigate("/")
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderInputField = (label, type, value, onChange, placeholder, icon, toggleIcon) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-500 transition-colors">
          {icon}
        </div>
        <input
          type={toggleIcon ? (showPassword ? "text" : "password") : type}
          className="w-full pl-11 pr-11 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500 transition-all duration-200 outline-none text-gray-800"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={type}
          required
        />
        {toggleIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-teal-500 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]">
        {/* Left Column */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-12 w-5/12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 opacity-90"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_80%)]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <img
              src={kriyaats || "/placeholder.svg"}
              alt="Kriya ATS Logo"
              className="w-36 mb-8 filter drop-shadow-lg"
            />
            <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Kriya ATS</h1>
            <p className="text-xl text-teal-50 text-center max-w-md">
              Streamline your hiring process with ease and efficiency.
            </p>

            <div className="mt-12 w-full max-w-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-white/90 italic mb-4">
                  "Kriya ATS has transformed our recruitment workflow completely!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-300 flex items-center justify-center text-teal-800 font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Ivan Percival Veniegas</p>
                    <p className="text-xs text-white/70">Culture & People</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-full md:w-7/12">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h2>
            <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>

            <form onSubmit={handleLogin} className="space-y-6">
              {renderInputField(
                "Email",
                "email",
                email,
                (e) => setEmail(e.target.value),
                "Enter your email",
                <FiMail className="h-5 w-5" />,
              )}
              {renderInputField(
                "Password",
                "password",
                password,
                (e) => setPassword(e.target.value),
                "Enter your password",
                <FiLock className="h-5 w-5" />,
                true,
              )}

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm animate-fadeIn">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link
                  to="/reset-password"
                  className="text-sm text-teal-600 hover:text-teal-700 transition"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:translate-y-[-2px] ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}