import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/authStore";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/Register";
import { GigFeed } from "@/pages/gigs/GigFeed";
import { GigDetail } from "@/pages/gigs/GigDetail";
import { PostGig } from "@/pages/gigs/PostGig";
import { FreelancerDirectory } from "@/pages/freelancers/FreelancerDirectory";
import { WorkerDashboard } from "@/pages/dashboard/WorkerDashboard";
import { PosterDashboard } from "@/pages/dashboard/PosterDashboard";
import { Messages } from "@/pages/messages/Messages";
import { Profile } from "@/pages/profile/Profile";
import { EditProfile } from "@/pages/profile/EditProfile";
import { NotFound } from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/gigs" element={<GigFeed />} />
          <Route path="/gigs/new" element={<PostGig />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="/freelancers" element={<FreelancerDirectory />} />
          <Route path="/dashboard" element={<WorkerDashboard />} />
          <Route path="/dashboard/poster" element={<PosterDashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
