import { columns, User } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(): Promise<User[]> {
  const response = await fetch("http://localhost:3000/api/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const users = await response.json();
  return users;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto p-10">
      <div className="mb-6 flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage your users here.
          </p>
        </div>
        <Link href="/users/create">
          <Button size="lg">Add User</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
