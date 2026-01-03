import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, BarChart3, Users } from 'lucide-react';
import { toast } from "sonner";

import DashboardStats from '@/components/dashboard/DashboardStats';
import SEOPostForm from '@/components/seo/SEOPostForm';
import PostResults from '@/components/seo/PostResults';
import JobForm from '@/components/jobs/JobForm';
import JobsTable from '@/components/jobs/JobsTable';
import CustomersTable from '@/components/customers/CustomersTable';
import ReviewModal from '@/components/customers/ReviewModal';

// Post generation functions
function generateFacebookPost(data) {
  const { companyName, serviceType, area, phone, email, website } = data;
  const contact = [];
  if (phone) contact.push(`📞 ${phone}`);
  if (email) contact.push(`✉️ ${email}`);
  if (website) contact.push(`🌐 ${website}`);
  
  const text = `✅ Another successful ${serviceType} completed in ${area}!

${companyName} just helped another local family reclaim their space. We handled everything from start to finish - quick, professional, and eco-friendly disposal.

Need junk removal? We serve the entire ${area.split(',')[0]} area with same-day and next-day appointments available!

${contact.join('\n')}

FREE quote - no hidden fees! Book your cleanout today! 🚚`;

  const serviceTag = serviceType.replace(/\s+/g, '');
  const areaTag = area.split(',')[0].replace(/\s+/g, '');
  const hashtags = `#JunkRemoval #${areaTag} #${serviceTag} #LocalBusiness #EcoFriendly #Declutter`;

  return { text, hashtags };
}

function generateInstagramPost(data) {
  const { companyName, serviceType, area, phone } = data;
  const text = `Another ${area} transformation! ✨

${companyName} specializes in ${serviceType} and eco-friendly disposal. We make it easy - you point, we haul! 

Same-day service available 📞 ${phone}

Tag someone who needs this! 👇`;

  const serviceTag = serviceType.replace(/\s+/g, '');
  const areaTag = area.split(',')[0].replace(/\s+/g, '');
  const hashtags = `#JunkRemoval #${serviceTag} #${areaTag} #BeforeAndAfter #HomeImprovement #Decluttering #LocalBusiness #SmallBusiness #EcoFriendly`;

  return { text, hashtags };
}

function generateTwitterPost(data) {
  const { companyName, serviceType, area, phone, website } = data;
  const link = website || `Call ${phone}`;
  const text = `✅ Just completed a ${serviceType} in ${area}!

${companyName} makes junk removal easy. Same-day service, eco-friendly disposal, no hidden fees.

Need a cleanout? ${link}`;

  const serviceTag = serviceType.replace(/\s+/g, '');
  const areaTag = area.split(',')[0].replace(/\s+/g, '');
  const hashtags = `#JunkRemoval #${areaTag} #${serviceTag} #LocalService`;

  return { text, hashtags };
}

function generateNextdoorPost(data) {
  const { companyName, serviceType, area, phone, email, website } = data;
  const contact = [];
  if (phone) contact.push(`Call/text: ${phone}`);
  if (email) contact.push(`Email: ${email}`);
  if (website) contact.push(`Website: ${website}`);
  
  const text = `Hi neighbors! 👋

${companyName} just completed a ${serviceType} right here in ${area}!

As a local, family-owned business, we take pride in serving our community with reliable, affordable junk removal. Whether it's a single item or a whole house cleanout, we've got you covered.

✅ Same-day & next-day service
✅ Eco-friendly disposal & donation
✅ Free estimates
✅ No hidden fees
✅ Fully licensed & insured

${contact.join('\n')}

Supporting local businesses keeps our neighborhood strong. We'd love to help with your next project!`;

  return { text, hashtags: null };
}

function generateThreadsPost(data) {
  const { companyName, serviceType, area, phone } = data;
  const text = `Just wrapped up another ${serviceType} in ${area}! 

The satisfaction of transforming a cluttered space into a clean slate never gets old 🙌

${companyName} - making your space livable again, one haul at a time.

DM or call ${phone} for a free quote!`;

  const serviceTag = serviceType.replace(/\s+/g, '');
  const areaTag = area.split(',')[0].replace(/\s+/g, '');
  const hashtags = `#JunkRemoval #SmallBusiness #${areaTag} #${serviceTag}`;

  return { text, hashtags };
}

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('seo');
  const [generatedPosts, setGeneratedPosts] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFilterMonth, setJobFilterMonth] = useState('');
  const [customerFilterMonth, setCustomerFilterMonth] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [reviewCustomer, setReviewCustomer] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const jobFormRef = useRef(null);

  // Fetch jobs
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.Job.list('-date')
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: (jobData) => base44.entities.Job.create(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job saved successfully!');
    }
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Job.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job updated successfully!');
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (id) => base44.entities.Job.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully!');
    }
  });

  const handleGeneratePosts = (formData) => {
    const posts = {
      facebook: generateFacebookPost(formData),
      instagram: generateInstagramPost(formData),
      twitter: generateTwitterPost(formData),
      nextdoor: generateNextdoorPost(formData),
      threads: generateThreadsPost(formData)
    };
    setGeneratedPosts(posts);
    setPhotoUrl(formData.photoUrl);
    toast.success('Posts generated successfully! 🎉');
  };

  const handleSaveJob = (jobData, editId) => {
    if (editId) {
      updateJobMutation.mutate({ id: editId, data: jobData });
    } else {
      createJobMutation.mutate(jobData);
    }
    setEditingJob(null);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    jobFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteJob = (id) => {
    if (confirm('Are you sure you want to delete this job?')) {
      deleteJobMutation.mutate(id);
    }
  };

  const exportJobsToCSV = () => {
    let exportJobs = jobs;
    let filename = 'all_jobs.csv';

    if (jobFilterMonth) {
      const [year, month] = jobFilterMonth.split('-');
      exportJobs = jobs.filter(job => {
        const jobDate = new Date(job.date);
        return jobDate.getFullYear() === parseInt(year) && 
               jobDate.getMonth() === parseInt(month) - 1;
      });
      filename = `jobs_${jobFilterMonth}.csv`;
    }

    const headers = ['Date', 'Customer', 'Phone', 'Email', 'Address', 'Marketing Source', 
                   'Gross', 'Dump Fee', 'Labor', 'Gas', 'U-Haul', 'Other Expenses', 
                   'Total Expenses', 'Profit/Loss', 'Margin %'];
    
    const rows = exportJobs.map(job => [
      job.date,
      job.customer_name,
      job.phone,
      job.email || '',
      job.address,
      job.marketing_source,
      job.gross?.toFixed(2),
      job.dump_fee?.toFixed(2),
      job.labor?.toFixed(2),
      job.gas?.toFixed(2),
      job.uhaul?.toFixed(2),
      job.other_expenses?.toFixed(2),
      job.total_expenses?.toFixed(2),
      job.profit?.toFixed(2),
      job.margin?.toFixed(2)
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    downloadCSV(csv, filename);
  };

  const exportCustomersToCSV = () => {
    const customersMap = new Map();

    jobs.forEach(job => {
      const key = job.phone;
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: job.customer_name,
          phone: job.phone,
          email: job.email || '',
          address: job.address,
          jobCount: 0,
          totalSpent: 0,
          lastJobDate: job.date
        });
      }

      const customer = customersMap.get(key);
      customer.jobCount++;
      customer.totalSpent += job.gross || 0;
      if (job.date > customer.lastJobDate) {
        customer.lastJobDate = job.date;
      }
    });

    const customers = Array.from(customersMap.values());
    const headers = ['Name', 'Phone', 'Email', 'Address', 'Total Jobs', 'Total Spent', 'Last Job Date'];
    const rows = customers.map(c => [
      c.name,
      c.phone,
      c.email,
      c.address,
      c.jobCount,
      c.totalSpent.toFixed(2),
      c.lastJobDate
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    downloadCSV(csv, 'customers.csv');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendReview = (customer) => {
    setReviewCustomer(customer);
    setIsReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-6 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            🚚 Junk Removal Business Dashboard
          </h1>
          <p className="mt-2 text-violet-100 text-lg">Track jobs, customers, and profits all in one place</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Dashboard Stats */}
        <DashboardStats jobs={jobs} />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-white p-1.5 rounded-xl shadow-md h-auto flex-wrap">
            <TabsTrigger 
              value="seo" 
              className="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Smartphone className="w-4 h-4" /> SEO Post Generator
            </TabsTrigger>
            <TabsTrigger 
              value="jobs" 
              className="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <BarChart3 className="w-4 h-4" /> Profit & Loss Tracker
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="flex items-center gap-2 px-5 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all"
            >
              <Users className="w-4 h-4" /> Customer Database
            </TabsTrigger>
          </TabsList>

          {/* SEO Tab */}
          <TabsContent value="seo" className="mt-6 space-y-6">
            <SEOPostForm onGenerate={handleGeneratePosts} />
            {generatedPosts && <PostResults posts={generatedPosts} photoUrl={photoUrl} />}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="mt-6 space-y-6">
            <div ref={jobFormRef}>
              <JobForm 
                onSave={handleSaveJob} 
                editJob={editingJob}
                onCancelEdit={() => setEditingJob(null)}
              />
            </div>
            <JobsTable
              jobs={jobs}
              filterMonth={jobFilterMonth}
              onFilterChange={setJobFilterMonth}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onExport={exportJobsToCSV}
            />
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="mt-6">
            <CustomersTable
              jobs={jobs}
              filterMonth={customerFilterMonth}
              searchQuery={customerSearch}
              onFilterChange={setCustomerFilterMonth}
              onSearchChange={setCustomerSearch}
              onSendReview={handleSendReview}
              onExport={exportCustomersToCSV}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        customer={reviewCustomer}
      />
    </div>
  );
}