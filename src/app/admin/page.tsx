import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight">无权访问</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          仅管理员可访问此页面。
        </p>
        <a
          href="/"
          className="mt-6 text-sm text-primary underline underline-offset-4"
        >
          返回首页
        </a>
      </div>
    );
  }

  const db = getDb();
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">管理员面板</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        管理注册用户和系统配置。
      </p>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">注册用户（{allUsers.length}）</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border/50">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">名称</th>
                <th className="px-4 py-3 font-medium">邮箱</th>
                <th className="px-4 py-3 font-medium">角色</th>
                <th className="px-4 py-3 font-medium">注册时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{u.id}</td>
                  <td className="px-4 py-3">{u.name || "—"}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleString("zh-CN")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
