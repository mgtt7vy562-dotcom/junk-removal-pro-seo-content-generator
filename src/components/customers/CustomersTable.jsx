import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, Mail } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomersTable({ jobs, filterMonth, searchQuery, onFilterChange, onSearchChange, onSendReview, onExport }) {
  // Build customers map from jobs
  const customersMap = new Map();

  jobs.forEach(job => {
    const key = job.phone;
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: job.customer_name,
        phone: job.phone,
        email: job.email || '',
        address: job.address,
        jobs: [],
        totalSpent: 0,
        lastJobDate: job.date
      });
    }

    const customer = customersMap.get(key);
    customer.jobs.push(job);
    customer.totalSpent += job.gross || 0;
    if (job.date > customer.lastJobDate) {
      customer.lastJobDate = job.date;
    }
  });

  let customers = Array.from(customersMap.values());

  // Apply filters
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    customers = customers.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query)
    );
  }

  if (filterMonth) {
    const [year, month] = filterMonth.split('-');
    customers = customers.filter(c => {
      const lastDate = new Date(c.lastJobDate);
      return lastDate.getFullYear() === parseInt(year) && 
             lastDate.getMonth() === parseInt(month) - 1;
    });
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <Card className="border-0 shadow-md">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Filter by Month</Label>
              <Input
                type="month"
                value={filterMonth}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-48 h-10 border-slate-200"
              />
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label className="text-sm font-semibold text-slate-700">Search</Label>
              <Input
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name, phone, email..."
                className="h-10 border-slate-200"
              />
            </div>
            {(filterMonth || searchQuery) && (
              <Button variant="outline" onClick={() => { onFilterChange(''); onSearchChange(''); }} size="sm">
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <CardTitle className="text-lg font-bold text-slate-900">Customer Database</CardTitle>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" /> Export to Spreadsheet
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Address</TableHead>
                  <TableHead className="font-semibold text-center">Total Jobs</TableHead>
                  <TableHead className="font-semibold text-right">Total Spent</TableHead>
                  <TableHead className="font-semibold">Last Job</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Users className="w-16 h-16 mb-3 opacity-50" />
                        <p className="text-lg">No customers yet</p>
                        <p className="text-sm">Add jobs to build your customer database!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="text-slate-500">{customer.email || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
                      <TableCell className="text-center">
                        <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                          {customer.jobs.length}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        ${customer.totalSpent.toFixed(2)}
                      </TableCell>
                      <TableCell>{format(new Date(customer.lastJobDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            onClick={() => onSendReview(customer)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Mail className="w-4 h-4 mr-1" /> Send Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}