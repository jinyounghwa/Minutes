import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Link2, Ghost, Trash2, Search, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">MeetingNotes</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: Version Control & Diff View is here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Manage Meetings <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Without the Chaos</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Ditch the link hell of Confluence and the slowness of Jira. MeetingNotes is the fastest, most intuitive way to capture, link, and manage your team&apos;s decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-lg">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-lg">
              View Demo
            </Button>
          </div>
          
          {/* Dashboard Preview Mockup */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10 h-40 bottom-0"></div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900 mx-auto max-w-5xl aspect-[16/9] p-4">
              <div className="flex gap-4 h-full">
                <div className="w-1/4 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-4">
                   <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                   <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                   <div className="pt-4 space-y-2">
                     <div className="h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded w-full"></div>
                     <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                     <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                   </div>
                </div>
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-6 space-y-6">
                   <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                   <div className="space-y-3">
                     <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                     <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                     <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-4/6"></div>
                   </div>
                   <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 dark:border-indigo-900/30 dark:bg-indigo-900/10">
                     <div className="flex items-center gap-2 mb-2">
                        <Link2 className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">Inline Preview: Q4 Strategy</span>
                     </div>
                     <div className="h-20 bg-white/50 dark:bg-slate-800/50 rounded-lg"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Everything you need to stay synced</h2>
            <p className="text-slate-600 dark:text-slate-400">Built for teams that move fast and hate bureaucracy.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Link2, title: 'No More Link Hell', desc: 'Inline previews and side-panel views let you browse documentation without losing context.' },
              { icon: Trash2, title: 'Smart Deletion', desc: 'Impact analysis before you delete anything. Soft-delete with a 30-day recovery window.' },
              { icon: Ghost, title: 'Version Control', desc: 'Auto-snapshots and side-by-side diff view. Restore any version with a single click.' },
              { icon: Search, title: 'Instant Search', desc: 'Semantic search that scans tags, content, and action items in milliseconds.' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Granular access levels: Public, Team, Private, or Custom per document.' },
              { icon: Users, title: 'Team Collaboration', desc: 'Mention teammates, assign action items, and track progress effortlessly.' },

            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-xl group">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-indigo-600 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
             
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Stop wasting time in Confluence.</h2>
             <p className="text-indigo-100 text-lg mb-10 relative z-10">Join 500+ teams who have already switched to a faster way of documenting meetings.</p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
               <Button size="lg" variant="secondary" className="px-8 font-bold">Start Free Trial</Button>
               <Button size="lg" variant="outline" className="border-indigo-400 text-white hover:bg-white/10 px-8">Contact Sales</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© 2025 MeetingNotes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
