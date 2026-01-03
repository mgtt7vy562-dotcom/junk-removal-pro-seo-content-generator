import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({ label, value, type = "default", icon: Icon }) {
  return (
    <Card className={cn(
      "relative overflow-hidden p-6 bg-white border-l-4 transition-all duration-300 hover:shadow-lg",
      type === "profit" && "border-l-emerald-500",
      type === "loss" && "border-l-red-500",
      type === "default" && "border-l-violet-500"
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          {Icon && <Icon className="w-5 h-5 text-slate-400" />}
        </div>
        <p className={cn(
          "text-3xl font-bold mt-2 tracking-tight",
          type === "profit" && "text-emerald-600",
          type === "loss" && "text-red-600",
          type === "default" && "text-slate-900"
        )}>
          {value}
        </p>
      </div>
    </Card>
  );
}