"use client"

import type * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconCreditCard,
  IconUser,
  IconKey,
  IconRocket,
  IconFileText,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
      isActive: true,
    },
    {
      title: "Tables",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Billing",
      url: "#",
      icon: IconCreditCard,
    },
    {
      title: "RTL",
      url: "#",
      icon: IconFileText,
    },
  ],
  accountPages: [
    {
      title: "Profile",
      url: "#",
      icon: IconUser,
    },
    {
      title: "Sign In",
      url: "#",
      icon: IconKey,
    },
    {
      title: "Sign Up",
      url: "#",
      icon: IconRocket,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r">
      <SidebarHeader className="border-b ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-[22px]">
              <a href="#" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-500">
                  <IconInnerShadowTop className="!size-5 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-700">PURITY UI DASHBOARD</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.accountPages} title="ACCOUNT PAGES" className="mt-6" />
      </SidebarContent>
    </Sidebar>
  )
}
