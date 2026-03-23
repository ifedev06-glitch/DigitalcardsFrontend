// 'use client'

// import { useState } from 'react'
// import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
// import { adminLogin } from '@/lib/api'

// export function LoginPage({ onLogin }: { onLogin: () => void }) {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')

//     if (!email || !password) {
//       setError('Please fill in all fields')
//       return
//     }

//     setIsLoading(true)
//     try {
//       const response = await adminLogin({ email, password })
//       localStorage.setItem('jwtToken', response.token)
//       localStorage.setItem('isLoggedIn', 'true')
//       localStorage.setItem('userEmail', response.email)
//       localStorage.setItem('orgSlug', response.organizationSlug)
//       onLogin()
//     } catch (err: any) {
//       setError(err?.response?.data?.message || err?.message || 'Invalid email or password')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo/Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-white mb-4">
//             <span className="text-2xl font-bold">BC</span>
//           </div>
//           <h1 className="text-3xl font-bold text-foreground mb-2">Digital Cards</h1>
//           <p className="text-muted-foreground">Manage your team's business cards</p>
//         </div>

//         {/* Login Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="rounded-2xl border border-border bg-card p-8 shadow-lg"
//         >
//           {error && (
//             <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
//               {error}
//             </div>
//           )}

//           {/* Email Field */}
//           <div className="mb-5">
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 className="w-full rounded-lg border border-border bg-input pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
//               />
//             </div>
//           </div>

//           {/* Password Field */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-foreground mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full rounded-lg border border-border bg-input pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Remember Me & Forgot Password */}
//           <div className="mb-6 flex items-center justify-between text-sm">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="rounded border border-border w-4 h-4 cursor-pointer"
//               />
//               <span className="text-muted-foreground">Remember me</span>
//             </label>
//             <a href="#" className="text-primary hover:underline font-medium">
//               Forgot password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 mb-4"
//           >
//             {isLoading ? 'Signing in...' : 'Sign In'}
//           </button>

//           {/* Sign Up Link */}
//           <p className="text-center text-sm text-muted-foreground">
//             Don't have an account?{' '}
//             <a href="#" className="text-primary font-medium hover:underline">
//               Sign up
//             </a>
//           </p>
//         </form>

//         {/* Footer */}
//         <p className="text-center text-xs text-muted-foreground mt-8">
//           Protected by enterprise-grade security
//         </p>
//       </div>
//     </div>
//   )
// }