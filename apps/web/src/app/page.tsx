'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Brain, Shield, Users, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BentoGrid, BentoGridItem } from '@/components/landing/BentoGrid';
import { motion } from 'framer-motion';

const Scene = dynamic(() => import('@/components/landing/Scene'), { ssr: false });

export default function LandingPage() {
  const items = [
    {
      title: "지능형 분석",
      description: "주요 포인트를 자동으로 추출하고 정리합니다. 긴 회의를 위한 스마트 요약.",
      header: <SkeletonOne />,
      icon: <Brain className="h-4 w-4 text-indigo-400" />,
      className: "md:col-span-2 border-white/10 bg-white/5 hover:bg-white/10",
    },
    {
      title: "팀 협업",
      description: "팀과 실시간으로 협업하세요. 인사이트를 즉시 공유하십시오.",
      header: <SkeletonTwo />,
      icon: <Users className="h-4 w-4 text-neutral-400" />,
      className: "md:col-span-1 border-white/10 bg-white/5 hover:bg-white/10",
    },
    {
      title: "데이터 시각화",
      description: "직관적인 그래프로 회의 추세 및 타임라인을 시각화합니다.",
      header: <SkeletonThree />,
      icon: <BarChart className="h-4 w-4 text-neutral-400" />,
      className: "md:col-span-1 border-white/10 bg-white/5 hover:bg-white/10",
    },
    {
      title: "엔터프라이즈 보안",
      description: "은행급 암호화 및 세분화된 권한 제어.",
      header: <SkeletonFour />,
      icon: <Shield className="h-4 w-4 text-neutral-400" />,
      className: "md:col-span-2 border-white/10 bg-white/5 hover:bg-white/10",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 h-screen w-full">
         <Scene />
         <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <span className="text-white">M</span>
            </div>
            Minutes
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              로그인
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-white text-black hover:bg-gray-200 border-none font-semibold">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-24">
             {/* Badge */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-indigo-300 mb-8"
             >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                버전 2.0 출시
             </motion.div>
             
             <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 pb-2"
             >
                회의 기록의 <br />
                재정의
             </motion.h1>
             
             <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
             >
                혼란스러운 논의를 체계적인 인사이트로 변환합니다. <br className="hidden md:block" />
                현대 팀을 위한 지능형 협업 공간입니다.
             </motion.p>
             
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
             >
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 text-lg bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all hover:scale-105 shadow-xl shadow-indigo-900/20">
                    무료로 시작하기 <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                   <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full backdrop-blur-sm border-white/20 bg-white/5 hover:bg-white/10 text-white">
                     데모 보기
                   </Button>
                </Link>
             </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="relative z-10 max-w-6xl mx-auto">
            <BentoGrid>
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={<span className="text-white text-lg">{item.title}</span>}
                        description={<span className="text-gray-400">{item.description}</span>}
                        header={item.header}
                        icon={item.icon}
                        className={item.className}
                    />
                ))}
            </BentoGrid>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10 bg-black text-gray-500 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; 2026 Minutes Inc.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">개인정보</a>
            <a href="#" className="hover:text-white transition-colors">약관</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

const SkeletonOne = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-900/20 to-indigo-900/5 border border-indigo-500/20 p-6 relative overflow-hidden group-hover:border-indigo-500/40 transition-colors">
     <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors" />
     <div className="space-y-3 relative z-10">
        <div className="h-2 w-1/3 bg-indigo-500/50 rounded-full" />
        <div className="h-2 w-full bg-white/10 rounded-full" />
        <div className="h-2 w-full bg-white/10 rounded-full" />
        <div className="h-2 w-2/3 bg-white/10 rounded-full" />
     </div>
  </div>
);
const SkeletonTwo = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 items-center justify-center group-hover:border-purple-500/40 transition-colors">
     <div className="flex -space-x-4">
        {[1,2,3].map((i) => (
            <div key={i} className="w-12 h-12 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg" />
        ))}
     </div>
  </div>
);
const SkeletonThree = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-900/20 to-pink-900/5 border border-pink-500/20 items-end justify-between p-6 pb-4 gap-3 group-hover:border-pink-500/40 transition-colors">
      <div className="w-1/4 bg-pink-500/30 h-1/3 rounded-t-sm" />
      <div className="w-1/4 bg-pink-500/60 h-2/3 rounded-t-sm" />
      <div className="w-1/4 bg-pink-500 h-full rounded-t-sm shadow-[0_0_15px_rgba(236,72,153,0.5)]" />
  </div>
);
const SkeletonFour = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border border-emerald-500/20 items-center justify-center group-hover:border-emerald-500/40 transition-colors">
     <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
        <Shield className="relative z-10 w-16 h-16 text-emerald-400" />
     </div>
  </div>
);