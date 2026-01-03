import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Info } from 'lucide-react';

const MARKETING_SOURCES = [
  "Google", "Yard Sign", "Nextdoor", "Facebook", "Instagram", 
  "Referral", "Repeat Customer", "Realtor", "Other"
];

export default function JobForm({ onSave, editJob, onCancelEdit }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    marketing_source: '',
    gross: '',
    dump_fee: '0',
    labor: '0',
    gas: '0',
    uhaul: '0',
    other_expenses: '0'
  });

  useEffect(() => {
    if (editJob) {
      setFormData({
        date: editJob.date || new Date().toISOString().split('T')[0],
        customer_name: editJob.customer_name || '',
        phone: editJob.phone || '',
        email: editJob.email || '',
        address: editJob.address || '',
        marketing_source: editJob.marketing_source || '',
        gross: String(editJob.gross || ''),
        dump_fee: String(editJob.dump_fee || 0),
        labor: String(editJob.labor || 0),
        gas: String(editJob.gas || 0),
        uhaul: String(editJob.uhaul || 0),
        other_expenses: String(editJob.other_expenses || 0)
      });
    }
  }, [editJob]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const gross = parseFloat(formData.gross) || 0;
    const dumpFee = parseFloat(formData.dump_fee) || 0;
    const labor = parseFloat(formData.labor) || 0;
    const gas = parseFloat(formData.gas) || 0;
    const uhaul = parseFloat(formData.uhaul) || 0;
    const otherExpenses = parseFloat(formData.other_expenses) || 0;
    
    const totalExpenses = dumpFee + labor + gas + uhaul + otherExpenses;
    const profit = gross - totalExpenses;
    const margin = gross > 0 ? (profit / gross) * 100 : 0;

    const jobData = {
      ...formData,
      gross,
      dump_fee: dumpFee,
      labor,
      gas,
      uhaul,
      other_expenses: otherExpenses,
      total_expenses: totalExpenses,
      profit,
      margin
    };

    onSave(jobData, editJob?.id);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      customer_name: '',
      phone: '',
      email: '',
      address: '',
      marketing_source: '',
      gross: '',
      dump_fee: '0',
      labor: '0',
      gas: '0',
      uhaul: '0',
      other_expenses: '0'
    });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">
          {editJob ? 'Edit Job' : 'Add New Job'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-11 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Customer Name *</Label>
              <Input
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="John Smith"
                className="h-11 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Phone *</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="h-11 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@email.com"
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-slate-700">Address *</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, Austin, TX 78701"
                className="h-11 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Marketing Source *</Label>
              <Select
                value={formData.marketing_source}
                onValueChange={(value) => setFormData({ ...formData, marketing_source: value })}
                required
              >
                <SelectTrigger className="h-11 border-slate-200">
                  <SelectValue placeholder="Select source..." />
                </SelectTrigger>
                <SelectContent>
                  {MARKETING_SOURCES.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Total Gross (Revenue) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.gross}
                onChange={(e) => setFormData({ ...formData, gross: e.target.value })}
                placeholder="450.00"
                className="h-11 border-slate-200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Dump Fee</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.dump_fee}
                onChange={(e) => setFormData({ ...formData, dump_fee: e.target.value })}
                placeholder="80.00"
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Labor Pay</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.labor}
                onChange={(e) => setFormData({ ...formData, labor: e.target.value })}
                placeholder="60.00"
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Gas</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.gas}
                onChange={(e) => setFormData({ ...formData, gas: e.target.value })}
                placeholder="20.00"
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">U-Haul Rental</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.uhaul}
                onChange={(e) => setFormData({ ...formData, uhaul: e.target.value })}
                placeholder="0.00"
                className="h-11 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Other Expenses</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.other_expenses}
                onChange={(e) => setFormData({ ...formData, other_expenses: e.target.value })}
                placeholder="0.00"
                className="h-11 border-slate-200"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Profit/Loss will be calculated automatically based on your inputs
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Save className="w-5 h-5 mr-2" />
              {editJob ? 'Update Job' : 'Save Job'}
            </Button>
            {editJob && (
              <Button type="button" variant="outline" onClick={resetForm} className="h-12">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}