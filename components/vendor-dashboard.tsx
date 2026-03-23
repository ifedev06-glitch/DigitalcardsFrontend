// 'use client'

// import { useState, useEffect } from 'react'
// import { Menu, X, Settings, Users, BarChart3, LogOut, ExternalLink, Plus, QrCode, Mail, MessageCircle, Link as LinkIcon } from 'lucide-react'
// import { LoginPage } from './login-page'
// import {
//   getAllProfiles,
//   createProfile,
//   updateProfile,
//   deleteProfile,
//   ProfileResponse,
// } from '@/lib/api'

// type Section = 'dashboard' | 'staff' | 'profile' | 'analytics' | 'settings' | 'public-profile'

// interface StaffMember {
//   id: string
//   name: string
//   position: string
//   email: string
//   phone: string
//   linkedin: string
//   uniqueLink: string
//   views: number
// }

// interface CompanyBranding {
//   logo: string
//   companyName: string
//   primaryColor: string
//   secondaryColor: string
// }

// export function BusinessCardDashboard() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [currentSection, setCurrentSection] = useState<Section>('dashboard')
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [darkMode, setDarkMode] = useState(false)
//   const [companyBranding, setCompanyBranding] = useState<CompanyBranding>({
//     logo: 'BC',
//     companyName: 'Digital Cards Co',
//     primaryColor: '#3f5ffe',
//     secondaryColor: '#4dd0e1',
//   })
//   const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
//     {
//       id: '1',
//       name: 'Sarah Anderson',
//       position: 'Sales Director',
//       email: 'sarah@example.com',
//       phone: '+1-555-0123',
//       linkedin: 'linkedin.com/in/sarah',
//       uniqueLink: 'digitalcards.app/sarah-anderson',
//       views: 324,
//     },
//     {
//       id: '2',
//       name: 'John Smith',
//       position: 'Marketing Lead',
//       email: 'john@example.com',
//       phone: '+1-555-0124',
//       linkedin: 'linkedin.com/in/john',
//       uniqueLink: 'digitalcards.app/john-smith',
//       views: 156,
//     },
//   ])
//   const [profiles, setProfiles] = useState<ProfileResponse[]>([])
//   const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
//   const [selectedProfile, setSelectedProfile] = useState<ProfileResponse | null>(null)

//   const orgSlug = typeof window !== 'undefined' ? localStorage.getItem('orgSlug') ?? '' : ''

//   // Load profiles from backend when logged in
//   useEffect(() => {
//     if (!isLoggedIn || !orgSlug) return
//     getAllProfiles(orgSlug)
//       .then(setProfiles)
//       .catch(console.error)
//   }, [isLoggedIn, orgSlug])

//   const containerClass = darkMode ? 'dark' : ''

//   if (!isLoggedIn) {
//     return (
//       <div className={containerClass}>
//         <LoginPage onLogin={() => setIsLoggedIn(true)} />
//       </div>
//     )
//   }

//   return (
//     <div className={containerClass}>
//       <div className="min-h-screen bg-background text-foreground">
//         {/* Header */}
//         <header className="sticky top-0 z-50 border-b border-border bg-card">
//           <div className="flex items-center justify-between px-6 py-4">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//                 className="lg:hidden"
//               >
//                 {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//               <div className="flex items-center gap-3">
//                 <div
//                   className="flex h-10 w-10 items-center justify-center rounded-lg font-semibold text-white"
//                   style={{ backgroundColor: companyBranding.primaryColor }}
//                 >
//                   {companyBranding.logo}
//                 </div>
//                 <h1 className="text-lg font-semibold">{companyBranding.companyName}</h1>
//               </div>
//             </div>
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
//             >
//               {darkMode ? '☀️ Light' : '🌙 Dark'}
//             </button>
//           </div>
//         </header>

//         <div className="flex">
//           {/* Sidebar */}
//           <aside
//             className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:static ${
//               sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//             }`}
//             style={{ marginTop: '73px' }}
//           >
//             <nav className="space-y-2 p-6">
//               <button
//                 onClick={() => {
//                   setCurrentSection('dashboard')
//                   setSidebarOpen(false)
//                 }}
//                 className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
//                   currentSection === 'dashboard'
//                     ? 'bg-primary text-primary-foreground'
//                     : 'hover:bg-muted'
//                 }`}
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => {
//                   setCurrentSection('staff')
//                   setSidebarOpen(false)
//                 }}
//                 className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
//                   currentSection === 'staff'
//                     ? 'bg-primary text-primary-foreground'
//                     : 'hover:bg-muted'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <Users size={18} />
//                   Staff Members
//                 </div>
//               </button>
//               <button
//                 onClick={() => {
//                   setCurrentSection('analytics')
//                   setSidebarOpen(false)
//                 }}
//                 className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
//                   currentSection === 'analytics'
//                     ? 'bg-primary text-primary-foreground'
//                     : 'hover:bg-muted'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <BarChart3 size={18} />
//                   Analytics
//                 </div>
//               </button>
//               <button
//                 onClick={() => {
//                   setCurrentSection('profile')
//                   setSidebarOpen(false)
//                 }}
//                 className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
//                   currentSection === 'profile'
//                     ? 'bg-primary text-primary-foreground'
//                     : 'hover:bg-muted'
//                 }`}
//               >
//                 Profile
//               </button>
//               <button
//                 onClick={() => {
//                   setCurrentSection('settings')
//                   setSidebarOpen(false)
//                 }}
//                 className={`w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${
//                   currentSection === 'settings'
//                     ? 'bg-primary text-primary-foreground'
//                     : 'hover:bg-muted'
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <Settings size={18} />
//                   Settings
//                 </div>
//               </button>
//               <button
//                 onClick={() => setIsLoggedIn(false)}
//                 className="w-full rounded-lg px-4 py-3 text-left font-medium text-destructive transition-colors hover:bg-muted"
//               >
//                 <div className="flex items-center gap-3">
//                   <LogOut size={18} />
//                   Logout
//                 </div>
//               </button>
//             </nav>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 pt-6">
//             {currentSection === 'dashboard' && (
//               <DashboardSection
//                 staffMembers={staffMembers}
//                 companyBranding={companyBranding}
//                 onEditStaff={(staff) => {
//                   setSelectedStaff(staff)
//                   setCurrentSection('staff')
//                 }}
//               />
//             )}
//             {currentSection === 'staff' && (
//               <StaffSection
//                 staffMembers={staffMembers}
//                 setStaffMembers={setStaffMembers}
//                 selectedStaff={selectedStaff}
//                 setSelectedStaff={setSelectedStaff}
//                 profiles={profiles}
//                 setProfiles={setProfiles}
//                 orgSlug={orgSlug}
//                 onViewProfile={(staff) => {
//                   setSelectedStaff(staff)
//                   setCurrentSection('public-profile')
//                 }}
//                 onViewApiProfile={(profile) => {
//                   setSelectedProfile(profile)
//                   setCurrentSection('public-profile')
//                 }}
//               />
//             )}
//             {currentSection === 'analytics' && (
//               <AnalyticsSection staffMembers={staffMembers} />
//             )}
//             {currentSection === 'profile' && (
//               <ProfileSection
//                 companyBranding={companyBranding}
//                 setCompanyBranding={setCompanyBranding}
//               />
//             )}
//             {currentSection === 'settings' && (
//               <SettingsSection
//                 companyBranding={companyBranding}
//                 setCompanyBranding={setCompanyBranding}
//               />
//             )}
//             {currentSection === 'public-profile' && selectedStaff && (
//               <PublicProfileSection
//                 staff={selectedStaff}
//                 companyBranding={companyBranding}
//                 onBack={() => setCurrentSection('staff')}
//               />
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   )
// }

// function DashboardSection({ staffMembers, companyBranding, onEditStaff }: {
//   staffMembers: StaffMember[]
//   companyBranding: CompanyBranding
//   onEditStaff: (staff: StaffMember) => void
// }) {
//   const totalViews = staffMembers.reduce((sum, staff) => sum + staff.views, 0)

//   return (
//     <div className="px-6 pb-12">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold">Welcome Back!</h2>
//         <p className="mt-2 text-muted-foreground">
//           Manage your team's digital business cards and track engagement
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
//           <p className="mt-2 text-3xl font-bold">{staffMembers.length}</p>
//         </div>
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <p className="text-sm font-medium text-muted-foreground">Total Views</p>
//           <p className="mt-2 text-3xl font-bold">{totalViews}</p>
//         </div>
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <p className="text-sm font-medium text-muted-foreground">Active Links</p>
//           <p className="mt-2 text-3xl font-bold">{staffMembers.length}</p>
//         </div>
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <p className="text-sm font-medium text-muted-foreground">Subscription</p>
//           <p className="mt-2 text-lg font-bold">Premium</p>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="mb-8">
//         <h3 className="mb-4 text-xl font-semibold">Quick Actions</h3>
//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//           <button
//             style={{ borderColor: companyBranding.primaryColor, color: companyBranding.primaryColor }}
//             className="rounded-lg border-2 px-4 py-3 font-medium transition-colors hover:opacity-80"
//           >
//             <Plus size={18} className="mb-2 inline mr-2" />
//             Add Staff Member
//           </button>
//           <button className="rounded-lg border-2 border-muted px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-muted">
//             <Mail size={18} className="mb-2 inline mr-2" />
//             Send Invites
//           </button>
//           <button className="rounded-lg border-2 border-muted px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-muted">
//             <ExternalLink size={18} className="mb-2 inline mr-2" />
//             View Public Page
//           </button>
//         </div>
//       </div>

//       {/* Recent Staff */}
//       <div>
//         <h3 className="mb-4 text-xl font-semibold">Staff Members</h3>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {staffMembers.map((staff) => (
//             <div key={staff.id} className="rounded-lg border border-border bg-card p-6 shadow-sm">
//               <h4 className="font-semibold">{staff.name}</h4>
//               <p className="text-sm text-muted-foreground">{staff.position}</p>
//               <div className="mt-4 space-y-2 text-sm">
//                 <p className="text-muted-foreground">{staff.views} views</p>
//                 <button
//                   onClick={() => onEditStaff(staff)}
//                   className="text-primary font-medium hover:underline"
//                 >
//                   View Profile →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// function StaffSection({ staffMembers, setStaffMembers, selectedStaff, setSelectedStaff, profiles, setProfiles, orgSlug, onViewProfile, onViewApiProfile }: {
//   staffMembers: StaffMember[]
//   setStaffMembers: (staff: StaffMember[]) => void
//   selectedStaff: StaffMember | null
//   setSelectedStaff: (staff: StaffMember | null) => void
//   profiles: ProfileResponse[]
//   setProfiles: (profiles: ProfileResponse[]) => void
//   orgSlug: string
//   onViewProfile: (staff: StaffMember) => void
//   onViewApiProfile: (profile: ProfileResponse) => void
// }) {
//   const [showForm, setShowForm] = useState(false)
//   const [formName, setFormName] = useState('')
//   const [formRole, setFormRole] = useState('')
//   const [formLinkedin, setFormLinkedin] = useState('')
//   const [formInstagram, setFormInstagram] = useState('')
//   const [formAbout, setFormAbout] = useState('')
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formError, setFormError] = useState('')

//   const handleAddMember = async () => {
//     if (!formName || !formRole) {
//       setFormError('Name and role are required')
//       return
//     }
//     setIsSubmitting(true)
//     setFormError('')
//     try {
//       const newProfile = await createProfile(orgSlug, {
//         name: formName,
//         role: formRole,
//         linkedinUrl: formLinkedin,
//         instagramUrl: formInstagram,
//         about: formAbout,
//       })
//       setProfiles([...profiles, newProfile])
//       setShowForm(false)
//       setFormName('')
//       setFormRole('')
//       setFormLinkedin('')
//       setFormInstagram('')
//       setFormAbout('')
//     } catch (err: any) {
//       setFormError(err?.response?.data?.message || 'Failed to add member')
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleDeleteProfile = async (profileId: number) => {
//     if (!confirm('Delete this profile?')) return
//     try {
//       await deleteProfile(orgSlug, profileId)
//       setProfiles(profiles.filter((p) => p.id !== profileId))
//     } catch (err: any) {
//       alert(err?.response?.data?.message || 'Failed to delete profile')
//     }
//   }

//   return (
//     <div className="px-6 pb-12">
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold">Staff Members</h2>
//           <p className="mt-2 text-muted-foreground">
//             Manage your team and their digital business cards
//           </p>
//         </div>
//         <button
//           onClick={() => setShowForm(!showForm)}
//           className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
//         >
//           <Plus size={18} />
//           Add Staff
//         </button>
//       </div>

//       {showForm && (
//         <div className="mb-8 rounded-lg border border-border bg-card p-6 shadow-sm">
//           <h3 className="mb-4 text-lg font-semibold">Add New Staff Member</h3>
//           {formError && (
//             <p className="mb-3 text-sm text-destructive">{formError}</p>
//           )}
//           <div className="grid gap-4 md:grid-cols-2">
//             <input
//               placeholder="Name *"
//               value={formName}
//               onChange={(e) => setFormName(e.target.value)}
//               className="rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
//             />
//             <input
//               placeholder="Role *"
//               value={formRole}
//               onChange={(e) => setFormRole(e.target.value)}
//               className="rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
//             />
//             <input
//               placeholder="LinkedIn URL"
//               value={formLinkedin}
//               onChange={(e) => setFormLinkedin(e.target.value)}
//               className="rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring md:col-span-2"
//             />
//             <input
//               placeholder="Instagram URL"
//               value={formInstagram}
//               onChange={(e) => setFormInstagram(e.target.value)}
//               className="rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring md:col-span-2"
//             />
//             <textarea
//               placeholder="About"
//               value={formAbout}
//               onChange={(e) => setFormAbout(e.target.value)}
//               rows={2}
//               className="rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring md:col-span-2"
//             />
//           </div>
//           <div className="mt-4 flex flex-wrap gap-3">
//             <button
//               onClick={handleAddMember}
//               disabled={isSubmitting}
//               className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
//             >
//               {isSubmitting ? 'Adding...' : 'Add Member'}
//             </button>
//             <button className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:opacity-90 flex items-center gap-2">
//               <QrCode size={18} />
//               Generate NFC
//             </button>
//             <button
//               onClick={() => setShowForm(false)}
//               className="rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-muted"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* API Profiles (from backend) */}
//       {profiles.length > 0 && (
//         <div className="grid gap-4 mb-6">
//           {profiles.map((profile) => (
//             <div key={profile.id} className="rounded-lg border border-border bg-card p-6 shadow-sm">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold">{profile.name}</h3>
//                   <p className="text-muted-foreground">{profile.role}</p>
//                   {profile.about && (
//                     <p className="mt-1 text-sm text-muted-foreground">{profile.about}</p>
//                   )}
//                   <div className="mt-3 space-y-1 text-sm">
//                     {profile.linkedinUrl && <p className="text-primary">🔗 {profile.linkedinUrl}</p>}
//                     {profile.instagramUrl && <p className="text-muted-foreground">📸 {profile.instagramUrl}</p>}
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-shrink-0 ml-4">
//                   <button
//                     onClick={() => onViewApiProfile(profile)}
//                     className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
//                   >
//                     View Profile
//                   </button>
//                   <button
//                     onClick={() => handleDeleteProfile(profile.id)}
//                     className="rounded-lg border border-destructive px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Original local Staff List */}
//       <div className="grid gap-4">
//         {staffMembers.map((staff) => (
//           <div key={staff.id} className="rounded-lg border border-border bg-card p-6 shadow-sm">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold">{staff.name}</h3>
//                 <p className="text-muted-foreground">{staff.position}</p>
//                 <div className="mt-3 space-y-1 text-sm">
//                   <p>📧 {staff.email}</p>
//                   <p>📱 {staff.phone}</p>
//                   <p className="text-primary">🔗 {staff.uniqueLink}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-accent">{staff.views}</p>
//                 <p className="text-sm text-muted-foreground">Views</p>
//                 <div className="mt-4 flex gap-2">
//                   <button
//                     onClick={() => onViewProfile(staff)}
//                     className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-90"
//                   >
//                     View Profile
//                   </button>
//                   <button className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// function PublicProfileSection({ staff, companyBranding, onBack }: {
//   staff: StaffMember
//   companyBranding: CompanyBranding
//   onBack: () => void
// }) {
//   return (
//     <div className="px-6 pb-12">
//       <button
//         onClick={onBack}
//         className="mb-6 text-primary font-medium hover:underline"
//       >
//         ← Back to Staff
//       </button>

//       <div className="mx-auto max-w-md">
//         {/* Company Header */}
//         <div
//           className="rounded-t-2xl p-6 text-white"
//           style={{ backgroundColor: companyBranding.primaryColor }}
//         >
//           <div
//             className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
//             style={{ backgroundColor: companyBranding.secondaryColor }}
//           >
//             {companyBranding.logo}
//           </div>
//           <h2 className="text-center text-2xl font-bold">{companyBranding.companyName}</h2>
//         </div>

//         {/* Staff Info */}
//         <div className="rounded-b-2xl border border-border bg-card p-6 shadow-lg">
//           <h3 className="text-center text-2xl font-bold">{staff.name}</h3>
//           <p className="text-center text-lg text-accent">{staff.position}</p>

//           <div className="my-6 space-y-4 text-center text-sm">
//             <a href={`mailto:${staff.email}`} className="block text-muted-foreground hover:text-foreground">
//               {staff.email}
//             </a>
//             <a href={`tel:${staff.phone}`} className="block text-muted-foreground hover:text-foreground">
//               {staff.phone}
//             </a>
//           </div>

//           {/* CTA Buttons */}
//           <div className="space-y-3">
//             <button
//               style={{ backgroundColor: companyBranding.primaryColor }}
//               className="w-full rounded-lg py-3 font-medium text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
//             >
//               <Mail size={18} />
//               Save Contact (vCard)
//             </button>
//             <button
//               style={{ borderColor: companyBranding.secondaryColor, color: companyBranding.secondaryColor }}
//               className="w-full rounded-lg border-2 py-3 font-medium transition-colors hover:opacity-75 flex items-center justify-center gap-2"
//             >
//               <MessageCircle size={18} />
//               Message via WhatsApp
//             </button>
//             <button className="w-full rounded-lg border border-border bg-muted py-3 font-medium transition-colors hover:bg-muted/80 flex items-center justify-center gap-2">
//               <LinkIcon size={18} />
//               Copy Link
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// function AnalyticsSection({ staffMembers }: { staffMembers: StaffMember[] }) {
//   return (
//     <div className="px-6 pb-12">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold">Analytics</h2>
//         <p className="mt-2 text-muted-foreground">
//           Track engagement and performance of your team's digital business cards
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Total Metrics */}
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <h3 className="mb-4 text-lg font-semibold">Overview</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Total Views</span>
//               <span className="text-2xl font-bold">{staffMembers.reduce((sum, s) => sum + s.views, 0)}</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Average per Staff</span>
//               <span className="text-2xl font-bold">
//                 {Math.round(staffMembers.reduce((sum, s) => sum + s.views, 0) / staffMembers.length)}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Active Members</span>
//               <span className="text-2xl font-bold">{staffMembers.filter(s => s.views > 0).length}</span>
//             </div>
//           </div>
//         </div>

//         {/* Performance */}
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <h3 className="mb-4 text-lg font-semibold">This Month</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">New Views</span>
//               <span className="text-2xl font-bold text-accent">+45</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Cards Saved</span>
//               <span className="text-2xl font-bold text-accent">+12</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-muted-foreground">Messages Sent</span>
//               <span className="text-2xl font-bold text-accent">+8</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Staff Performance */}
//       <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
//         <h3 className="mb-4 text-lg font-semibold">Staff Performance</h3>
//         <div className="space-y-4">
//           {staffMembers.map((staff) => (
//             <div key={staff.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{staff.name}</p>
//                   <p className="text-sm text-muted-foreground">{staff.position}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xl font-bold">{staff.views}</p>
//                   <div className="mt-1 h-1.5 w-24 rounded-full bg-muted">
//                     <div
//                       className="h-full rounded-full bg-primary"
//                       style={{ width: `${Math.min((staff.views / 300) * 100, 100)}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// function ProfileSection({ companyBranding, setCompanyBranding }: {
//   companyBranding: CompanyBranding
//   setCompanyBranding: (branding: CompanyBranding) => void
// }) {
//   return (
//     <div className="px-6 pb-12">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold">Company Profile</h2>
//         <p className="mt-2 text-muted-foreground">
//           Customize your company's branding and information
//         </p>
//       </div>

//       <div className="max-w-2xl rounded-lg border border-border bg-card p-8 shadow-sm">
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium mb-2">Company Name</label>
//             <input
//               value={companyBranding.companyName}
//               onChange={(e) => setCompanyBranding({ ...companyBranding, companyName: e.target.value })}
//               className="w-full rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-2">Logo (Initials)</label>
//             <input
//               value={companyBranding.logo}
//               onChange={(e) => setCompanyBranding({ ...companyBranding, logo: e.target.value })}
//               maxLength={2}
//               className="w-full rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
//             />
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <label className="block text-sm font-medium mb-2">Primary Color</label>
//               <div className="flex gap-3">
//                 <input
//                   type="color"
//                   value={companyBranding.primaryColor}
//                   onChange={(e) => setCompanyBranding({ ...companyBranding, primaryColor: e.target.value })}
//                   className="h-10 w-20 rounded cursor-pointer border border-border"
//                 />
//                 <input
//                   type="text"
//                   value={companyBranding.primaryColor}
//                   onChange={(e) => setCompanyBranding({ ...companyBranding, primaryColor: e.target.value })}
//                   className="flex-1 rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Secondary Color</label>
//               <div className="flex gap-3">
//                 <input
//                   type="color"
//                   value={companyBranding.secondaryColor}
//                   onChange={(e) => setCompanyBranding({ ...companyBranding, secondaryColor: e.target.value })}
//                   className="h-10 w-20 rounded cursor-pointer border border-border"
//                 />
//                 <input
//                   type="text"
//                   value={companyBranding.secondaryColor}
//                   onChange={(e) => setCompanyBranding({ ...companyBranding, secondaryColor: e.target.value })}
//                   className="flex-1 rounded-lg border border-border bg-input px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-border pt-6">
//             <h3 className="mb-4 text-lg font-semibold">Preview</h3>
//             <div
//               className="mx-auto max-w-sm rounded-lg p-6 text-white text-center"
//               style={{ backgroundColor: companyBranding.primaryColor }}
//             >
//               <div
//                 className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full font-semibold"
//                 style={{ backgroundColor: companyBranding.secondaryColor }}
//               >
//                 {companyBranding.logo}
//               </div>
//               <h4 className="font-bold">{companyBranding.companyName}</h4>
//             </div>
//           </div>

//           <button className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90">
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// function SettingsSection({ companyBranding, setCompanyBranding }: {
//   companyBranding: CompanyBranding
//   setCompanyBranding: (branding: CompanyBranding) => void
// }) {
//   return (
//     <div className="px-6 pb-12">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold">Settings</h2>
//         <p className="mt-2 text-muted-foreground">
//           Manage your account and platform preferences
//         </p>
//       </div>

//       <div className="space-y-6 max-w-2xl">
//         {/* General Settings */}
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <h3 className="mb-4 text-lg font-semibold">General</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between border-b border-border pb-4">
//               <div>
//                 <p className="font-medium">Email Notifications</p>
//                 <p className="text-sm text-muted-foreground">Receive updates about your staff cards</p>
//               </div>
//               <input type="checkbox" defaultChecked className="h-5 w-5 cursor-pointer" />
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium">Analytics Emails</p>
//                 <p className="text-sm text-muted-foreground">Weekly performance reports</p>
//               </div>
//               <input type="checkbox" defaultChecked className="h-5 w-5 cursor-pointer" />
//             </div>
//           </div>
//         </div>

//         {/* Subscription */}
//         <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
//           <h3 className="mb-4 text-lg font-semibold">Subscription</h3>
//           <div className="space-y-4">
//             <div>
//               <p className="font-medium">Current Plan: Premium</p>
//               <p className="text-sm text-muted-foreground">$29.99/month • Next billing: March 20, 2024</p>
//             </div>
//             <div className="flex gap-3">
//               <button className="rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-muted">
//                 Manage Subscription
//               </button>
//               <button className="rounded-lg border border-destructive px-4 py-2 font-medium text-destructive transition-colors hover:bg-destructive/10">
//                 Downgrade Plan
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Danger Zone */}
//         <div className="rounded-lg border border-destructive bg-destructive/5 p-6">
//           <h3 className="mb-4 text-lg font-semibold text-destructive">Danger Zone</h3>
//           <button className="rounded-lg border border-destructive px-4 py-2 font-medium text-destructive transition-colors hover:bg-destructive/10">
//             Delete Account
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }