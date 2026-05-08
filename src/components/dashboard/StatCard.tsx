import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description?: string;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}

const StatCard = ({ title, value, icon: Icon, trend, description, color = 'primary' }: StatCardProps) => {
  return (
    <div className="bg-surface-2/50 backdrop-blur-xl border border-white/5 rounded-4xl p-8 relative overflow-hidden group hover:border-primary/40 transition-all duration-500 shadow-2xl">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Icon className={cn("w-24 h-24", 
          color === 'primary' ? 'text-primary' : 
          color === 'success' ? 'text-secondary' : 
          color === 'warning' ? 'text-tertiary' : 'text-error'
        )} />
      </div>
      
      <div className="space-y-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center border border-white/5 shadow-lg group-hover:border-primary/50 transition-colors">
          <Icon className={cn("w-6 h-6", 
            color === 'primary' ? 'text-primary' : 
            color === 'success' ? 'text-secondary' : 
            color === 'warning' ? 'text-tertiary' : 'text-error'
          )} />
        </div>

        <div className="space-y-1">
          <p className="font-jetbrains text-[9px] uppercase tracking-[0.3em] text-text-muted font-black opacity-60">{title}</p>
          <h3 className="text-4xl font-hanken font-bold text-text-main italic tracking-tighter">{value}</h3>
        </div>

        <div className="flex items-center gap-3">
          {trend && (
            <span className={cn(
              "px-3 py-1 rounded-xl text-[10px] font-jetbrains font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md",
              trend.isUp ? "text-secondary bg-secondary/10 border border-secondary/20" : "text-error bg-error/10 border border-error/20"
            )}>
              {trend.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.value}%
            </span>
          )}
          <span className="font-jetbrains text-[9px] text-text-muted uppercase tracking-[0.2em] font-bold opacity-40">
            {description || "vs last month"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
