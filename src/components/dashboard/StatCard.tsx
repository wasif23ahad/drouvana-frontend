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
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    destructive: 'text-error bg-error/10',
  };

  return (
    <div className="bg-surface-container-low backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className={cn("w-16 h-16", color === 'primary' ? 'text-primary' : color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-error')} />
      </div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{title}</p>
      <h3 className="text-3xl font-heading font-bold text-on-surface mb-4 italic">{value}</h3>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1",
            trend.isUp ? "text-success bg-success/10" : "text-error bg-error/10"
          )}>
            {trend.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter">
          {description || "vs last month"}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
