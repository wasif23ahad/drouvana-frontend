"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, Briefcase, CheckCircle2,
  FileText, LineChart, Mail, MessageSquare,
  ShieldCheck, Sparkles, Star, Target, ChevronDown, ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative w-full h-[65vh] min-h-[600px] overflow-hidden flex items-center justify-center bg-bg-base">
          {/* Background Contrast & Mesh */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="outline" className="mb-6 py-1.5 px-4 rounded-full border-primary/30 bg-primary/10 text-primary backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                  AI-Powered Job Tracker 1.0
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-hanken font-bold tracking-tight mb-6 text-text-main leading-[1.1]">
                  Land your dream job, <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-secondary animate-gradient-x">on autopilot.</span>
                </h1>
                <p className="text-lg text-text-sub mb-8 max-w-xl leading-relaxed">
                  Stop tracking jobs in spreadsheets. Drouvana uses AI to parse job descriptions, tailor resumes, and automate your entire search workflow.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto rounded-full group h-12 px-8">
                      Start for free
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full h-12 px-8 bg-surface/50 backdrop-blur-sm border-white/5">
                      How it works
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 hidden lg:block relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary/20 bg-surface/30 backdrop-blur-xl group aspect-video">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image 
                  src="/drouvana-dashboard.png" 
                  alt="Drouvana Dashboard Mockup" 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-accent/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-primary/10 rounded-full blur-3xl" />
            </motion.div>
          </div>

          {/* Scroll Indicator - Visual Flow */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-[10px] font-jetbrains uppercase tracking-[0.3em] ml-1">Explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.div>
        </section>

        {/* 2. Core Listing / Features Section */}
        <section id="features" className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-hanken font-bold mb-4">Everything you need to get hired</h2>
              <p className="text-text-sub text-lg max-w-2xl mx-auto">Our AI toolset is designed specifically for modern job seekers.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Job Tracker', desc: 'Kanban board for all applications with automated data parsing.', icon: BarChart3, price: 'Included', rating: '4.9/5' },
                { title: 'AI Resume Builder', desc: 'Create tailored resumes instantly based on the job description.', icon: FileText, price: 'Included', rating: '4.8/5' },
                { title: 'Cover Letters', desc: 'Generate keyword-optimized cover letters in seconds.', icon: Mail, price: 'Included', rating: '4.7/5' },
                { title: 'AI Career Coach', desc: 'Get interview prep and actionable advice from an AI assistant.', icon: MessageSquare, price: 'Premium', rating: '5.0/5' }
              ].map((feature, i) => (
                <Card key={i} className="flex flex-col h-full hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-base text-text-sub">{feature.desc}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-4 border-t border-border-subtle pt-6 mt-auto">
                    <div className="flex w-full justify-between items-center text-sm">
                      <span className="font-medium">{feature.price}</span>
                      <span className="flex items-center text-amber-500 font-medium"><Star className="h-3 w-3 mr-1 fill-current" />{feature.rating}</span>
                    </div>
                    <Link href="/register" className="w-full">
                      <Button variant="outline" className="w-full rounded-xl">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Highlights Section */}
        <section className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-hanken font-bold mb-6">Stop guessing. Start matching.</h2>
                <ul className="space-y-4">
                  {[
                    'Instant ATS compatibility scoring',
                    'Missing keyword identification',
                    'One-click resume tailoring',
                    'Real-time status updates'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-lg text-text-main">
                      <CheckCircle2 className="h-6 w-6 mr-3 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-12 shadow-xl aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="text-center text-text-sub relative z-10">
                  <LineChart className="h-20 w-20 mx-auto text-primary mb-4 opacity-50" />
                  <p className="font-jetbrains uppercase tracking-widest text-xs">Intelligence Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Statistics Section */}
        <section className="w-full py-20 glass-card mx-auto max-w-7xl rounded-3xl my-12 border-border-color shadow-2xl">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold font-hanken mb-2 text-primary">3x</div>
                <div className="text-text-sub text-sm uppercase tracking-widest font-jetbrains">More Interviews</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold font-hanken mb-2 text-secondary">95%</div>
                <div className="text-text-sub text-sm uppercase tracking-widest font-jetbrains">ATS Match Rate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold font-hanken mb-2 text-accent">10h+</div>
                <div className="text-text-sub text-sm uppercase tracking-widest font-jetbrains">Saved Weekly</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold font-hanken mb-2 text-success">10k+</div>
                <div className="text-text-sub text-sm uppercase tracking-widest font-jetbrains">Jobs Tracked</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How it Works */}
        <section id="how-it-works" className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
             <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-hanken font-bold mb-4">How Drouvana Works</h2>
              <p className="text-text-sub text-lg max-w-2xl mx-auto">Three simple steps to accelerate your career trajectory.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                { step: '01', title: 'Save a Job', desc: 'Drop a URL from LinkedIn or Indeed. AI extracts all the details instantly.' },
                { step: '02', title: 'Tailor & Apply', desc: 'Get an AI-tailored resume and cover letter matching the job requirements.' },
                { step: '03', title: 'Track Progress', desc: 'Move cards on your Kanban board and automate follow-up emails.' }
                ].map((item, i) => (
                  <div key={i} className="relative p-10 rounded-(--radius-premium) glass-card group hover:border-primary/40 transition-all overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                        <span className="text-primary font-bold font-mono text-sm">{item.step}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 font-hanken text-text-main">{item.title}</h3>
                      <p className="text-text-sub leading-relaxed font-sans text-base">{item.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* 6. AI Capabilities Showcase */}
        <section id="capabilities" className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-hanken font-bold mb-4">Every tool you need. All AI-powered.</h2>
              <p className="text-text-sub text-lg max-w-2xl mx-auto">From application tracking to interview prep — Drouvana handles the entire job search lifecycle.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: BarChart3,
                  title: 'Smart Job Tracker',
                  desc: 'Visualize your entire pipeline with a drag-and-drop Kanban board. Filter, search, and track every stage from Saved to Offer.',
                  tag: 'Kanban + List View',
                  color: 'text-primary bg-primary/10',
                },
                {
                  icon: FileText,
                  title: 'Resume Builder',
                  desc: 'Build beautiful, ATS-optimized resumes with 5+ professional templates. AI enhances your bullet points and tailors content to each JD.',
                  tag: 'FlowCV-style Editor',
                  color: 'text-secondary bg-secondary/10',
                },
                {
                  icon: Target,
                  title: 'ATS Score Analyzer',
                  desc: 'Upload your resume and a job description. Get instant keyword match scoring, missing skill identification, and rewrite suggestions.',
                  tag: 'Keyword Intelligence',
                  color: 'text-accent bg-accent/10',
                },
                {
                  icon: Mail,
                  title: 'Cover Letter Generator',
                  desc: 'Generate tailored cover letters in multiple tones — Professional, Enthusiastic, Concise. One-click save and copy.',
                  tag: 'Three Tone Variants',
                  color: 'text-success bg-success/10',
                },
                {
                  icon: MessageSquare,
                  title: 'Email Outreach Writer',
                  desc: 'Draft cold outreach, follow-up, and thank-you emails tuned to the specific job and company. Save drafts for later use.',
                  tag: 'Context-Aware AI',
                  color: 'text-primary bg-primary/10',
                },
                {
                  icon: Sparkles,
                  title: 'AI Career Coach',
                  desc: 'Chat with an intelligent assistant that knows your applications. Get interview prep, salary negotiation tips, and career guidance.',
                  tag: 'Live AI Chat',
                  color: 'text-secondary bg-secondary/10',
                },
              ].map((cap, i) => (
                <Card key={i} className="glass-card hover:border-primary/30 transition-all group flex flex-col">
                  <CardHeader>
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${cap.color}`}>
                      <cap.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-hanken">{cap.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <CardDescription className="text-base text-text-sub leading-relaxed">{cap.desc}</CardDescription>
                    <div className="mt-auto">
                      <span className="text-[10px] font-jetbrains uppercase tracking-widest text-text-muted bg-surface-2 px-3 py-1 rounded-full">{cap.tag}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-hanken font-bold mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "How does the AI tailor my resume?", a: "Our AI analyzes the job description to identify key requirements and keywords. It then intelligently maps your existing experience to these requirements, suggesting professional bullet point rewrites and formatting changes." },
                  { q: "Is Drouvana free to use?", a: "We offer a generous free tier that includes basic job tracking and resume analysis. For advanced AI features like cover letter generation and interview coaching, we offer premium subscription plans." },
                  { q: "Can I export my resume to PDF?", a: "Absolutely. Once your resume is tailored, you can export it as a professional, ATS-optimized PDF ready for submission." },
                  { q: "Does Drouvana track my interview status?", a: "Yes, our Kanban board allows you to move applications through stages like 'Applied', 'Screening', 'Interview', and 'Offer', keeping your entire search organized." }
                ].map((faq, i) => (
                  <div key={i} className="p-6 rounded-2xl glass-card border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                    <h3 className="text-lg font-bold font-hanken text-text-main mb-2 flex items-center justify-between">
                      {faq.q}
                      <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-text-sub text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Newsletter Section */}
        <section className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto rounded-(--radius-premium) bg-surface-2/30 backdrop-blur-xl border border-white/5 p-12 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <Mail className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-hanken font-bold mb-4">Stay ahead of the market</h2>
                <p className="text-text-sub text-lg mb-8 max-w-xl mx-auto">Get weekly AI-curated career strategies, resume tips, and job market insights delivered to your inbox.</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your work email" 
                    className="flex-1 bg-bg-base border border-white/10 rounded-full px-6 h-12 outline-none focus:border-primary transition-colors text-sm"
                  />
                  <Button className="rounded-full h-12 px-8 font-bold">Subscribe</Button>
                </div>
                <p className="text-[10px] text-text-muted mt-4 font-jetbrains uppercase tracking-widest">Join 5,000+ ambitious professionals</p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Pricing Section */}
        <section id="pricing" className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-hanken font-bold mb-4">Transparent Pricing</h2>
              <p className="text-text-sub text-lg max-w-2xl mx-auto">Choose the plan that fits your career goals.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: "Starter", price: "Free", features: ["10 Active Applications", "Basic Resume Analysis", "Community Support"], button: "Start for Free", popular: false },
                { name: "Pro", price: "$19/mo", features: ["Unlimited Applications", "Advanced AI Tailoring", "Cover Letter Generator", "Priority Support"], button: "Go Pro", popular: true },
                { name: "Premium", price: "$49/mo", features: ["Everything in Pro", "AI Interview Coach", "Career Strategy Sessions", "Custom Templates"], button: "Get Premium", popular: false }
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-(--radius-premium) glass-card flex flex-col ${plan.popular ? 'border-primary/50 ring-1 ring-primary/20 scale-105 z-10 bg-surface-2/40' : 'border-white/5'}`}>
                  {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1">Most Popular</Badge>}
                  <h3 className="text-xl font-bold font-hanken mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-6 font-hanken">{plan.price}</div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center text-sm text-text-sub">
                        <CheckCircle2 className="h-4 w-4 mr-3 text-success shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button className={`rounded-full w-full ${plan.popular ? 'bg-primary' : 'variant-outline'}`}>{plan.button}</Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Security / Privacy */}
        <section className="w-full py-24 bg-transparent border-t border-border-color">
          <div className="container mx-auto px-4 md:px-6 text-center">
             <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
               <ShieldCheck className="h-8 w-8 text-primary" />
             </div>
             <h2 className="text-3xl font-bold mb-4 font-hanken">Your Data is Secure</h2>
             <p className="text-text-sub max-w-2xl mx-auto text-lg leading-relaxed">
               We do not sell your personal data or resume information to third parties. Your job search is completely private and encrypted.
             </p>
          </div>
        </section>

        {/* 8. CTA Section */}
        <section className="w-full py-24 bg-linear-to-br from-primary to-accent text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
             <h2 className="text-4xl md:text-6xl font-hanken font-bold mb-6">Ready to land your next role?</h2>
             <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Join thousands of job seekers who are getting hired faster with AI-powered intelligence.</p>
             <Link href="/register">
               <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full h-16 px-12 text-xl font-bold shadow-2xl">
                 Create your free account
               </Button>
             </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
