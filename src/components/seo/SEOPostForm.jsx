import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SERVICE_TYPES = [
  { value: "garage cleanout", label: "Garage Cleanout" },
  { value: "estate cleanout", label: "Estate Cleanout" },
  { value: "furniture removal", label: "Furniture Removal" },
  { value: "appliance removal", label: "Appliance Removal" },
  { value: "mattress disposal", label: "Mattress Disposal" },
  { value: "hot tub removal", label: "Hot Tub Removal" },
  { value: "construction debris removal", label: "Construction Debris Removal" },
  { value: "yard waste removal", label: "Yard Waste Removal" },
  { value: "hoarding cleanout", label: "Hoarding Cleanout" },
  { value: "foreclosure cleanout", label: "Foreclosure Cleanout" },
];

export default function SEOPostForm({ onGenerate }) {
  const [formData, setFormData] = useState({
    companyName: '',
    serviceType: '',
    area: '',
    phone: '',
    email: '',
    website: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      onGenerate({ ...formData, photoUrl: photoPreview });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">Generate SEO-Optimized Social Media Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Company Name *</Label>
              <Input
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Tex Mex Junk Removal"
                className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                required
              >
                <SelectTrigger className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500">
                  <SelectValue placeholder="Select service..." />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Area/Neighborhood *</Label>
              <Input
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="Downtown Austin, TX"
                className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Phone Number *</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(512) 555-0123"
                className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@yourbusiness.com"
                className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Website</Label>
              <Input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourbusiness.com"
                className="h-11 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Job Photo (Optional)</Label>
            <label className="block cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 hover:border-violet-400 hover:bg-violet-50/50 ${photoPreview ? 'border-violet-400 bg-violet-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="max-w-xs mx-auto rounded-lg shadow-md" />
                ) : (
                  <>
                    <Camera className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                    <p className="text-slate-500 text-sm">Click to upload before/after photo</p>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !formData.companyName || !formData.serviceType || !formData.area || !formData.phone}
            className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-violet-500/30"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isLoading ? 'Generating...' : 'Generate Posts for All Platforms'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}