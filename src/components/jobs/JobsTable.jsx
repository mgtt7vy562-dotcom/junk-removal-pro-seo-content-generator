import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Download, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default function JobsTable({ jobs, filterMonth, onFilterChange, onEdit, onDelete, onExport }) {
  const filteredJobs = filterMonth 
    ? jobs.filter(job => {
        const [year, month] = filterMonth.split('-');
        const jobDate = new Date(job.date);
        return jobDate.getFullYear() === parseInt(year) && 
               jobDate.getMonth() === parseInt(month) - 1;
      })
    : jobs;

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
            {filterMonth && (
              <Button variant="outline" onClick={() => onFilterChange('')} size="sm">
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <CardTitle className="text-lg font-bold text-slate-900">All Jobs</CardTitle>
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
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Address</TableHead>
                  <TableHead className="font-semibold">Source</TableHead>
                  <TableHead className="font-semibold text-right">Gross</TableHead>
                  <TableHead className="font-semibold text-right">Expenses</TableHead>
                  <TableHead className="font-semibold text-right">Profit</TableHead>
                  <TableHead className="font-semibold text-right">Margin</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <FileSpreadsheet className="w-16 h-16 mb-3 opacity-50" />
                        <p className="text-lg">No jobs found</p>
                        <p className="text-sm">Add your first job above!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-slate-50/50">
                      <TableCell>{format(new Date(job.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="font-medium">{job.customer_name}</TableCell>
                      <TableCell>{job.phone}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{job.address}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                          {job.marketing_source}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">${job.gross?.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-slate-500">${job.total_expenses?.toFixed(2)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-bold",
                        job.profit >= 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        ${job.profit?.toFixed(2)}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-semibold",
                        job.profit >= 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {job.margin?.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button size="icon" variant="ghost" onClick={() => onEdit(job)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => onDelete(job.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
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