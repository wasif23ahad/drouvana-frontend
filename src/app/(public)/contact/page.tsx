import React from 'react';
import { Mail, MapPin, Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4 space-y-12">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-black tracking-tight mb-4 ">Get in <span className="text-primary">Touch</span></h1>
        <p className="text-xl text-muted-foreground">Have questions or feedback? Our team is here to help you accelerate your career.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass-card p-10 rounded-[40px] space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" className="rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input placeholder="john@example.com" className="rounded-xl h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input placeholder="How can we help?" className="rounded-xl h-12" />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <textarea 
              className="w-full h-32 p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
              placeholder="Tell us more about your request..."
            />
          </div>
          <Button className="w-full h-14 rounded-2xl bg-primary text-lg font-bold gap-3 shadow-xl shadow-primary/20">
            Send Message <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Info Side */}
        <div className="space-y-8 py-6">
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email Us', val: 'support@drouvana.ai' },
              { icon: MapPin, label: 'Headquarters', val: 'Silicon Valley, CA' },
              { icon: Globe, label: 'Social', val: '@drouvana_ai' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-bold">{item.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 rounded-[32px] border-primary/20 bg-primary/5 space-y-2">
            <h4 className="font-bold">Enterprise Inquiry?</h4>
            <p className="text-sm text-muted-foreground">Looking for Drouvana for your university or bootcamp? Let's discuss a partnership.</p>
            <button className="text-primary font-bold text-sm hover:underline mt-2 inline-block">Contact Sales →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
