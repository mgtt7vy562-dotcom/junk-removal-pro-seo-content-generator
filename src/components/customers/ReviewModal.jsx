import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Info } from 'lucide-react';
import { toast } from "sonner";

export default function ReviewModal({ isOpen, onClose, customer }) {
  const [formData, setFormData] = useState({
    platform: '',
    reviewLink: '',
    method: ''
  });
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (customer && formData.platform && formData.method) {
      const platformName = formData.platform === 'google' ? 'Google' : 'Yelp';
      
      let message = '';
      if (formData.method === 'email') {
        message = `Hi ${customer.name},

Thank you for choosing us for your junk removal! We hope you're enjoying your clean space.

If you have a moment, we'd really appreciate it if you could leave us a review on ${platformName}. Your feedback helps us serve our community better.

Leave a review here: ${formData.reviewLink || '[Your review link will appear here]'}

Thanks again!`;
      } else {
        message = `Hi ${customer.name}! Thanks for choosing us. We'd love a ${platformName} review! ${formData.reviewLink || '[Link]'}`;
      }
      setPreview(message);
    }
  }, [customer, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.method === 'email' && !customer.email) {
      toast.error('This customer has no email on file.');
      return;
    }

    await navigator.clipboard.writeText(preview);
    toast.success(
      `Review request copied to clipboard! Send it via ${formData.method === 'email' ? `email to ${customer.email}` : `SMS to ${customer.phone}`}`
    );
    
    setTimeout(() => {
      onClose();
      setFormData({ platform: '', reviewLink: '', method: '' });
    }, 1500);
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Send Review Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Customer</Label>
            <Input value={`${customer.name} - ${customer.phone}`} readOnly className="bg-slate-50" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Review Platform *</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData({ ...formData, platform: value })}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select platform..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Reviews</SelectItem>
                <SelectItem value="yelp">Yelp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Review Link *</Label>
            <Input
              type="url"
              value={formData.reviewLink}
              onChange={(e) => setFormData({ ...formData, reviewLink: e.target.value })}
              placeholder="https://g.page/r/..."
              className="h-11"
              required
            />
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                Get your Google review link from your Google Business Profile. For Yelp, use your business page URL.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Send Via *</Label>
            <Select
              value={formData.method}
              onValueChange={(value) => setFormData({ ...formData, method: value })}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select method..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS (Text)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {preview && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Preview Message</Label>
              <Textarea
                value={preview}
                readOnly
                className="min-h-[150px] bg-slate-50"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={!formData.platform || !formData.reviewLink || !formData.method}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
          >
            <Mail className="w-5 h-5 mr-2" /> Send Review Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}