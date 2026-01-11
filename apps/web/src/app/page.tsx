'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  ),
});

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white">M</span>
            </div>
            Minutes
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              로그인
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Spline 3D */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          {/* 
             NOTE: This is a demo Spline scene URL. 
             Replace it with your own from https://app.spline.design 
             Export -> Code -> React -> copy the scene URL.
          */}
          <Spline scene="https://prod.spline.design/kZDDjO5IyCgoJq8i/scene.splinecode" />
          
          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-indigo-300 mb-6 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI 기반 회의록 자동화 v2.0 출시
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
            회의의 미래를 <br />
            경험하세요
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            복잡한 회의 내용을 3D 공간처럼 입체적으로 정리합니다. <br className="hidden md:block" />
            AI가 실시간으로 분석하고, 팀과 함께 공유하는 새로운 차원의 협업.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all hover:scale-105">
                무료로 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
               <Button variant="outline" size="lg" className="h-12 px-8 text-base border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-sm">
                 데모 체험하기
               </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative py-32 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="실시간 AI 분석"
              description="회의가 진행되는 동안 AI가 자동으로 핵심 내용을 요약하고 액션 아이템을 추출합니다."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-blue-400" />}
              title="3D 협업 공간"
              description="단순한 텍스트가 아닌, 시각화된 데이터와 타임라인으로 회의 흐름을 한눈에 파악하세요."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-green-400" />}
              title="엔터프라이즈 보안"
              description="모든 데이터는 암호화되어 안전하게 저장되며, 팀별 접근 권한을 정밀하게 제어할 수 있습니다."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-gray-500 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            &copy; 2026 Minutes Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group cursor-pointer">
      <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}