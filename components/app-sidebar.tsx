"use client";

import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  RiDashboardLine,
  RiListUnordered,
  RiBarChartLine,
  RiFolderLine,
  RiGroupLine,
  RiCameraLine,
  RiFileTextLine,
  RiSettingsLine,
  RiQuestionLine,
  RiSearchLine,
  RiDatabase2Line,
  RiFileChartLine,
  RiFileLine,
  RiCommandLine,
} from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

const roleOptions = [
  { label: "USER", value: "USER" },
  { label: "ADMIN", value: "ADMIN" },
] as const;

interface User {
  id: string;
  name: string;
  email: string;
  role: (typeof roleOptions)[number]["value"];
  image: string;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    image: "",
  },
  navMain: [
    {
      title: "Productos",
      url: "/products",
      icon: <RiFolderLine />,
      roleView: roleOptions.map((option) => option.value),
    },
    {
      title: "Movimientos de inventario",
      url: "/movements/products",
      icon: <RiBarChartLine />,
      roleView: roleOptions.map((option) => option.value),
    },
    {
      title: "Usuarios",
      url: "/users",
      icon: <RiGroupLine />,
      roleView: roleOptions
        .map((option) => option.value)
        .filter((value) => value === "ADMIN"),
    },
    // {
    //   title: "Dashboard",
    //   url: "/dashboard",
    //   icon: <RiDashboardLine />,
    //   roleView: roleOptions.map((option) => option.value),
    // },
    // {
    //   title: "Pedidos",
    //   url: "/orders",
    //   icon: <RiListUnordered />,
    //   roleView: roleOptions.map((option) => option.value),
    // },
    // {
    //   title: "Clientes",
    //   url: "/customers",
    //   icon: <RiGroupLine />,
    //   roleView: roleOptions.map((option) => option.value),
    // },
    // {
    //   title: "Proveedores",
    //   url: "/suppliers",
    //   icon: <RiGroupLine />,
    //   roleView: roleOptions.map((option) => option.value),
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <RiCameraLine />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <RiFileTextLine />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <RiFileTextLine />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <RiSettingsLine />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <RiQuestionLine />,
    },
    {
      title: "Search",
      url: "#",
      icon: <RiSearchLine />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <RiDatabase2Line />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <RiFileChartLine />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <RiFileLine />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User>();

  async function getMe() {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user data.");
        }
        return res;
      });
      const userData = await response.json();
      setUser(userData.user);
    } catch (error) {}
  }

  React.useEffect(() => {
    getMe();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/welcome" />}
            >
              <Image
                src="/logo-white.svg"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-base font-semibold">
                Tienda de Mascotas
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} userRole={user?.role || ""} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
