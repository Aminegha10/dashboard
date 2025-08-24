import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "./ui/input"
import { Bell, Search, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function SiteHeader() {
  return (
    // <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
    //   <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    //     <SidebarTrigger className="-ml-1" />
    //     <Separator
    //       orientation="vertical"
    //       className="mx-2 data-[orientation=vertical]:h-4"
    //     />
    //     <h1 className="text-base font-medium">Documents</h1>
    //     <div className="ml-auto flex items-center gap-2">
    //       <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
    //         <a
    //           href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
    //           rel="noopener noreferrer"
    //           target="_blank"
    //           className="dark:text-foreground"
    //         >
              
    //         </a>
    //       </Button>
    //     </div>
    //   </div>
    // </header>
    //  <header className="border-b border-border bg-card">
    //       <div className="flex items-center justify-between px-6 py-4">
    //         <div className="flex items-center gap-4">
    //           <div className="relative">
    //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    //             <Input placeholder="Search here..." className="pl-10 w-80 bg-input border-border" />
    //           </div>
    //         </div>

    //         <div className="flex items-center gap-4">
    //           <Button variant="ghost" size="icon">
    //             <Bell className="h-5 w-5" />
    //           </Button>
    //           <div className="flex items-center gap-2">
    //             <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
    //               <User className="h-4 w-4 text-primary-foreground" />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </header>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <nav className="text-sm text-gray-500 dark:text-gray-400">
                Pages / <span className="text-gray-900 dark:text-white font-medium">Dashboard</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Type here..."
                  className="pl-10 w-64 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-teal-600">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
  )
}
