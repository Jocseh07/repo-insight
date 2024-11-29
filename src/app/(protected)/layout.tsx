import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import AppSidebar from "./app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";

const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarProvider>
        {/* App Sidebar */}
        <AppSidebar />
        <main className="m-2 w-full">
          <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md border p-2 px-4 shadow">
            {/* <SearchBar /> */}
            <div className="ml-auto"></div>
            <UserButton />
            <ModeToggle />
          </div>
          <div className="h-4"></div>
          {/* Main content */}
          <div className="border-sidebar-border bg-sidebar h-[calc(100dvh-5.4rem)] overflow-y-scroll rounded-md border p-4 shadow">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};
export default SidebarLayout;
