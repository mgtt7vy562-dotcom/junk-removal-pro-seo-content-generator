import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, Check, Rocket, Info } from 'lucide-react';
import { toast } from "sonner";

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877f2' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
  { id: 'twitter', name: 'X (Twitter)', icon: '✖️', color: '#000000' },
  { id: 'nextdoor', name: 'Nextdoor', icon: '🏘️', color: '#00b246' },
  { id: 'threads', name: 'Threads', icon: '🧵', color: '#000000' },
];

export default function PostResults({ posts, photoUrl }) {
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    PLATFORMS.reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
  );
  const [copiedPost, setCopiedPost] = useState(null);

  const copyPost = async (platform) => {
    const post = posts[platform];
    const text = post.hashtags ? `${post.text}\n\n${post.hashtags}` : post.text;
    await navigator.clipboard.writeText(text);
    setCopiedPost(platform);
    toast.success('Post copied to clipboard!');
    setTimeout(() => setCopiedPost(null), 2000);
  };

  const shareToFacebook = () => {
    const text = posts.facebook.text;
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const text = posts.twitter.text;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
  };

  const openPlatform = (platform) => {
    const urls = {
      instagram: 'https://www.instagram.com/',
      nextdoor: 'https://nextdoor.com/',
      threads: 'https://www.threads.net/'
    };
    copyPost(platform);
    window.open(urls[platform], '_blank');
  };

  const shareToSelected = () => {
    const selected = PLATFORMS.filter(p => selectedPlatforms[p.id]);
    if (selected.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    selected.forEach((platform, index) => {
      setTimeout(() => {
        switch (platform.id) {
          case 'facebook': shareToFacebook(); break;
          case 'twitter': shareToTwitter(); break;
          default: openPlatform(platform.id);
        }
      }, index * 500);
    });

    toast.success(`Opening ${selected.length} platform(s)...`);
  };

  const toggleAll = (checked) => {
    setSelectedPlatforms(PLATFORMS.reduce((acc, p) => ({ ...acc, [p.id]: checked }), {}));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Your Posts Are Ready! <span className="text-2xl">🎉</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Multi-Platform Share Section */}
        <div className="bg-slate-50 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> Share to Multiple Platforms
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PLATFORMS.map(platform => (
              <label
                key={platform.id}
                className="flex items-center gap-2 p-3 bg-white rounded-lg border-2 border-slate-200 cursor-pointer transition-all hover:border-violet-300 has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50"
              >
                <Checkbox
                  checked={selectedPlatforms[platform.id]}
                  onCheckedChange={(checked) => setSelectedPlatforms({ ...selectedPlatforms, [platform.id]: checked })}
                />
                <span className="text-sm font-medium">{platform.icon} {platform.name}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={shareToSelected}
              className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700"
            >
              <Rocket className="w-4 h-4 mr-2" /> Share to Selected Platforms
            </Button>
            <Button variant="outline" onClick={() => toggleAll(true)}>Select All</Button>
            <Button variant="outline" onClick={() => toggleAll(false)}>Clear All</Button>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> Select platforms → Click "Share to Selected" → Opens each platform in a new tab with your post pre-filled.
            </p>
          </div>
        </div>

        {/* Platform Tabs */}
        <Tabs defaultValue="facebook" className="w-full">
          <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-lg overflow-x-auto">
            {PLATFORMS.map(platform => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                {platform.icon} {platform.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {PLATFORMS.map(platform => (
            <TabsContent key={platform.id} value={platform.id} className="mt-4 space-y-4">
              <Textarea
                value={posts[platform.id]?.text || ''}
                readOnly
                className="min-h-[200px] bg-slate-50 border-slate-200"
              />
              
              {posts[platform.id]?.hashtags && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm font-semibold text-slate-700 mb-1">Hashtags:</p>
                  <p className="text-sm text-slate-600">{posts[platform.id].hashtags}</p>
                </div>
              )}

              {photoUrl && (
                <img src={photoUrl} alt="Job" className="max-w-full rounded-lg shadow-md" />
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => copyPost(platform.id)}
                  variant="outline"
                  className="flex-1"
                >
                  {copiedPost === platform.id ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy Post</>
                  )}
                </Button>
                <Button
                  onClick={() => platform.id === 'facebook' ? shareToFacebook() : platform.id === 'twitter' ? shareToTwitter() : openPlatform(platform.id)}
                  className="flex-1"
                  style={{ background: platform.color }}
                >
                  {platform.icon} {platform.id === 'instagram' || platform.id === 'nextdoor' || platform.id === 'threads' ? `Open ${platform.name}` : `Share to ${platform.name}`}
                </Button>
              </div>

              {(platform.id === 'instagram' || platform.id === 'nextdoor' || platform.id === 'threads') && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    {platform.name} doesn't support pre-filled posts. Click "Copy Post" then paste when {platform.name} opens.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}