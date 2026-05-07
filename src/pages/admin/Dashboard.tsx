import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Wallet, Clock, TrendingUp } from "lucide-react";
import { formatRp } from "@/data/menu";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pending: number;
  topItems: { name: string; qty: number }[];
}

const Dashboard = () => {
  const [s, setS] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, pending: 0, topItems: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: orders } = await supabase.from("orders").select("total,status");
      const { data: items } = await supabase.from("order_items").select("name,qty");
      const totalOrders = orders?.length ?? 0;
      const totalRevenue = (orders ?? []).filter(o => o.status !== "dibatalkan").reduce((a, b) => a + Number(b.total), 0);
      const pending = (orders ?? []).filter(o => o.status === "baru").length;
      const map = new Map<string, number>();
      (items ?? []).forEach(i => map.set(i.name, (map.get(i.name) ?? 0) + i.qty));
      const topItems = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));
      setS({ totalOrders, totalRevenue, pending, topItems });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Total Pesanan", value: s.totalOrders, icon: ShoppingBag },
    { label: "Total Omzet", value: formatRp(s.totalRevenue), icon: Wallet },
    { label: "Pesanan Baru", value: s.pending, icon: Clock },
    { label: "Status", value: loading ? "Memuat..." : "Live", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan performa Akumoo</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 font-display text-2xl">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-xl">Menu Terlaris</h2>
        {s.topItems.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Belum ada data pesanan.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {s.topItems.map((t, i) => (
              <li key={t.name} className="flex items-center justify-between py-2 text-sm">
                <span><span className="mr-2 text-muted-foreground">#{i + 1}</span>{t.name}</span>
                <span className="font-semibold">{t.qty} terjual</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
