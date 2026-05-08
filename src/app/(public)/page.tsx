import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, BarChart3, Briefcase, CheckCircle2, 
  FileText, LineChart, Mail, MessageSquare, 
  ShieldCheck, Sparkles, Star 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden flex items-center justify-center min-h-[60vh]">
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <Badge variant="outline" className="mb-6 py-1.5 px-4 rounded-full border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              AI-Powered Job Tracker 1.0
            </Badge>
            <h1 className="max-w-4xl mx-auto text-4xl md:text-5xl lg:text-7xl font-hanken font-bold tracking-tight mb-8 text-text-main">
              Land your dream job, <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">on autopilot.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-sub mb-10">
              Stop tracking jobs in spreadsheets. Drouvana uses AI to parse job descriptions, tailor your resume, write cover letters, and track your applications in one seamless board.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto rounded-full group">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
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
                    <Button variant="outline" className="w-full rounded-xl">View Details</Button>
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
                  <div key={i} className="relative p-10 rounded-[2.5rem] glass-card group hover:border-primary/40 transition-all overflow-hidden">
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

        {/* 6. Testimonials */}
        <section id="testimonials" className="w-full py-20 bg-transparent">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-hanken font-bold mb-12 text-center">Loved by Job Seekers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { quote: "I was spending hours tweaking my resume for every application. Drouvana does it in seconds.", author: "Sarah J.", role: "Software Engineer" },
                { quote: "The Kanban board is a lifesaver. I finally know exactly where I stand with my 40+ applications.", author: "Michael T.", role: "Product Manager" },
                { quote: "The AI coach helped me prep for my interview at Google and I got the offer!", author: "Elena R.", role: "UX Designer" }
              ].map((test, i) => (
                <Card key={i} className="glass-card hover:bg-surface-2/30 transition-colors">
                  <CardHeader>
                    <div className="flex gap-1 mb-2">
                       {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-main italic mb-6 leading-relaxed">&quot;{test.quote}&quot;</p>
                    <div>
                      <p className="font-semibold font-hanken text-primary">{test.author}</p>
                      <p className="text-sm text-text-muted font-jetbrains uppercase tracking-widest">{test.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Security / Privacy */}
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
