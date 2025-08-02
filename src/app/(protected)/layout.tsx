import Header from "@/components/layout/header";
import ProtectedLayout from "@/components/layout/ProtectedLayout";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>
        
        {children}
        
        </>
      );
}
