'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BentoGrid, BentoGridItem } from '@/components/landing/BentoGrid';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const items = [
    {
      title: "스마트 요약",
      description: "긴 회의도 핵심만 간결하게. 자동으로 중요한 내용을 추출하여 정리합니다.",
      header: <SkeletonOne />,
      icon: <Zap className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
    {
      title: "팀 협업",
      description: "실시간으로 팀원들과 문서를 공유하고 의견을 나눌 수 있습니다.",
      header: <SkeletonTwo />,
      icon: <Users className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
    },
    {
      title: "데이터 시각화",
      description: "회의 데이터를 직관적인 그래프와 타임라인으로 확인하세요.",
      header: <SkeletonThree />,
      icon: <BarChart className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-1",
    },
    {
      title: "엔터프라이즈 보안",
      description: "철저한 암호화와 권한 관리로 소중한 정보를 안전하게 보호합니다.",
      header: <SkeletonFour />,
      icon: <Shield className="h-4 w-4 text-neutral-500" />,
      className: "md:col-span-2",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white">M</span>
            </div>
            Minutes
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">
              로그인
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
             {/* Badge */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 backdrop-blur-md text-xs font-medium text-indigo-600 dark:text-indigo-300 mb-6"
             >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                차세대 회의록 관리 v2.0
             </motion.div>
             
             <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-white/60 pb-2"
             >
                회의의 본질에 <br />
                집중하세요
             </motion.h1>
             
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
             >
                복잡한 대화를 스마트하게 정리하고, <br className="hidden md:block" />
                팀의 실행력을 높여주는 통합 워크스페이스.
             </motion.p>
             
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
             >
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all hover:scale-105">
                    무료로 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                   <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full backdrop-blur-sm border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5">
                     데모 체험하기
                   </Button>
                </Link>
             </motion.div>
        </div>

        {/* Bento Grid */}
        <BentoGrid>
            {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    icon={item.icon}
                    className={item.className}
                />
            ))}
        </BentoGrid>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black text-slate-500 dark:text-gray-500 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; 2026 Minutes Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const SkeletonOne = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 p-4">
     <div className="space-y-2 w-full">
        <div className="h-2 w-1/2 bg-indigo-200 dark:bg-neutral-700 rounded-full animate-pulse" />
        <div className="h-2 w-full bg-indigo-100 dark:bg-neutral-800 rounded-full animate-pulse delay-75" />
        <div className="h-2 w-full bg-indigo-100 dark:bg-neutral-800 rounded-full animate-pulse delay-150" />
        <div className="h-2 w-3/4 bg-indigo-100 dark:bg-neutral-800 rounded-full animate-pulse delay-200" />
     </div>
  </div>
);
const SkeletonTwo = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 items-center justify-center">
     <div className="flex -space-x-3">
        {[1,2,3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-900 bg-indigo-300 dark:bg-neutral-700" />
        ))}
     </div>
  </div>
);
const SkeletonThree = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 items-end justify-between p-4 pb-2 gap-2">
      <div className="w-1/4 bg-indigo-300 dark:bg-neutral-700 h-1/2 rounded-t-md" />
      <div className="w-1/4 bg-indigo-400 dark:bg-neutral-600 h-3/4 rounded-t-md" />
      <div className="w-1/4 bg-indigo-500 dark:bg-neutral-500 h-full rounded-t-md" />
  </div>
);
const SkeletonFour = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800 items-center justify-center">
     <Shield className="w-12 h-12 text-indigo-200 dark:text-neutral-700" />
  </div>
);
