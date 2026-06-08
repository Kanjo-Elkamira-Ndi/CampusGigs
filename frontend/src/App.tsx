import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/auth/Login";
import { RegisterPage } from "@/pages/auth/Register";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPassword";
import { ResetPasswordPage } from "@/pages/auth/ResetPassword";
import { GigFeed } from "@/pages/gigs/GigFeed";
import { GigDetail } from "@/pages/gigs/GigDetail";
import { PostGig } from "@/pages/gigs/PostGig";
import { FreelancerDirectory } from "@/pages/freelancers/FreelancerDirectory";
import { WorkerDashboard } from "@/pages/dashboard/WorkerDashboard";
import { PosterDashboard } from "@/pages/dashboard/PosterDashboard";
import { SavedGigs } from "@/pages/dashboard/SavedGigs";
import { MyApplicationsPage } from "@/pages/dashboard/MyApplicationsPage";
import { PosterGigs } from "@/pages/dashboard/PosterGigs";
import { ApplicantsPage } from "@/pages/dashboard/ApplicantsPage";
import { NotificationsPage } from "@/pages/dashboard/NotificationsPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { Messages } from "@/pages/messages/Messages";
import { Profile } from "@/pages/profile/Profile";
import { EditProfile } from "@/pages/profile/EditProfile";
import { NotFound } from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const location = useLocation();
  useEffect(() => { hydrate(); }, [hydrate]);

  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/messages" ||
    location.pathname === "/gigs/new" ||
    location.pathname.startsWith("/profile/");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!isDashboardRoute && <Navbar />}
      <div className={`flex-1 ${!isDashboardRoute ? "pt-16" : ""}`}>
        <Outlet />
      </div>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "gigs", element: <GigFeed /> },
      { path: "gigs/new", element: <PostGig /> },
      { path: "gigs/:id", element: <GigDetail /> },
      { path: "freelancers", element: <FreelancerDirectory /> },
      { path: "dashboard", element: <WorkerDashboard /> },
      { path: "dashboard/saved", element: <SavedGigs /> },
      { path: "dashboard/applications", element: <MyApplicationsPage /> },
      { path: "dashboard/poster", element: <PosterDashboard /> },
      { path: "dashboard/poster/gigs", element: <PosterGigs /> },
      { path: "dashboard/poster/applicants", element: <ApplicantsPage /> },
      { path: "dashboard/notifications", element: <NotificationsPage /> },
      { path: "dashboard/settings", element: <SettingsPage /> },
      { path: "messages", element: <Messages /> },
      { path: "profile/edit", element: <EditProfile /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
