import React from 'react';
import StatCard from './StatCard';
import { Briefcase, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function DashboardStats({ jobs = [] }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthJobs = jobs.filter(job => {
    const jobDate = new Date(job.date);
    return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
  });

  const totalJobs = monthJobs.length;
  const uniqueCustomers = new Set(monthJobs.map(j => j.phone)).size;
  const totalGross = monthJobs.reduce((sum, job) => sum + (job.gross || 0), 0);
  const totalProfit = monthJobs.reduce((sum, job) => sum + (job.profit || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Jobs This Month"
        value={totalJobs}
        icon={Briefcase}
      />
      <StatCard
        label="Total Customers"
        value={uniqueCustomers}
        icon={Users}
      />
      <StatCard
        label="Gross Revenue"
        value={`$${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        icon={DollarSign}
      />
      <StatCard
        label="Net Profit/Loss"
        value={`$${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        type={totalProfit >= 0 ? "profit" : "loss"}
        icon={TrendingUp}
      />
    </div>
  );
}