import Footer from "@/components/Footer";
import AdminBottomNav from "@/components/Nav/AdminBottomNav";
import AdminSideNav from "@/components/Nav/AdminSideNav";
import { AllUsersProvider } from "@/store/allUsersContext";
import { Inter } from "next/font/google";
import WithAdminAuth from "./WithAdminAuth";

const inter = Inter({ subsets: ["latin"], weight: "400" });


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AllUsersProvider>
      <WithAdminAuth>
        <div className={`${inter.className} text-white antialiased md:flex`}>
          <AdminSideNav />
          <main className="flex-1 ml-0 md:ml-[220px]">
            {children}
            <Footer />
          </main>
          <AdminBottomNav />
        </div>
      </WithAdminAuth>
    </AllUsersProvider>
  );
}