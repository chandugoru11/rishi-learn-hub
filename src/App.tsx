import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Certification from "./pages/Certification";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import VerifyCertificate from "./pages/VerifyCertificate";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentOrders from "./pages/student/StudentOrders";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCRM from "./pages/admin/AdminCRM";
import AdminWhatsApp from "./pages/admin/AdminWhatsApp";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminExams from "./pages/admin/AdminExams";
import AdminAttendance from "./pages/admin/AdminAttendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar />{children}<Footer /></>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
            <Route path="/certification" element={<PublicLayout><Certification /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><ProtectedRoute><Cart /></ProtectedRoute></PublicLayout>} />
            <Route path="/verify/:certId" element={<PublicLayout><VerifyCertificate /></PublicLayout>} />

            {/* Dashboard redirect */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Student */}
            <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/courses" element={<ProtectedRoute><StudentCourses /></ProtectedRoute>} />
            <Route path="/student/certificates" element={<ProtectedRoute><StudentCertificates /></ProtectedRoute>} />
            <Route path="/student/orders" element={<ProtectedRoute><StudentOrders /></ProtectedRoute>} />

            {/* Instructor */}
            <Route path="/instructor" element={<ProtectedRoute requiredRole="instructor"><InstructorDashboard /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/crm" element={<ProtectedRoute requiredRole="admin"><AdminCRM /></ProtectedRoute>} />
            <Route path="/admin/whatsapp" element={<ProtectedRoute requiredRole="admin"><AdminWhatsApp /></ProtectedRoute>} />
            <Route path="/admin/campaigns" element={<ProtectedRoute requiredRole="admin"><AdminCampaigns /></ProtectedRoute>} />
            <Route path="/admin/exams" element={<ProtectedRoute requiredRole="admin"><AdminExams /></ProtectedRoute>} />
            <Route path="/admin/attendance" element={<ProtectedRoute requiredRole="admin"><AdminAttendance /></ProtectedRoute>} />

            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
