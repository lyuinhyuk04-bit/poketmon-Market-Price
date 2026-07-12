"use client";

import React from "react";
import { Sparkles, DollarSign } from "lucide-react";

interface AdBannerProps {
  position: "top" | "middle" | "bottom";
}

export default function AdBanner({ position }: AdBannerProps) {
  // Label changes based on position
  const getBannerDetails = () => {
    switch (position) {
      case "top":
        return {
          title: "포켓몬 카드 샵 & 굿즈 초특가 기획전",
          desc: "인기 부스터 팩 및 한정판 슬리브/매트 단독 특가 찬스!",
          badge: "스폰서 광고",
        };
      case "middle":
        return {
          title: "PSA 등급 대행 & 카드 보호 솔루션",
          desc: "당신의 소중한 카드, 안전하게 감정받고 등급 캡슐로 보호하세요.",
          badge: "추천 광고",
        };
      case "bottom":
        return {
          title: "전 세계 포켓몬 카드 직구 & 트레이드 서비스",
          desc: "일본/미국 미개봉 박스 및 싱글 카드 가장 빠르고 안전한 구매 대행",
          badge: "AD",
        };
    }
  };

  const details = getBannerDetails();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-6">
      {/* Container simulating Google AdSense Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 border border-indigo-500/10 hover:border-indigo-500/20 transition-all p-0.5 shadow-md">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Inside Banner Card */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 rounded-[14px] bg-slate-950/40 backdrop-blur-md">
          {/* Ad Badge Indicator */}
          <span className="absolute top-2 right-3 text-[9px] font-bold tracking-wider text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            {details.badge}
          </span>
          
          <div className="flex items-center gap-4 text-center md:text-left">
            {/* Visual Icon */}
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h5 className="text-slate-100 font-bold text-base tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                <span>{details.title}</span>
              </h5>
              <p className="text-slate-400 text-xs font-normal">
                {details.desc}
              </p>
            </div>
          </div>

          {/* Action CTA Button */}
          <a
            href="https://google.com/adsense"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all active:scale-95 whitespace-nowrap"
          >
            <DollarSign size={14} />
            <span>자세히 보기</span>
          </a>
        </div>
      </div>
    </div>
  );
}
