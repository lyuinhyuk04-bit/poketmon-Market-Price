"use client";

import React, { useState } from "react";
import { PokemonCard } from "@/lib/pokemonData";
import PriceChart from "./PriceChart";
import AdBanner from "./AdBanner";
import { ChevronDown, Image as ImageIcon, Sparkles, TrendingUp } from "lucide-react";

interface PriceTableProps {
  card: PokemonCard;
  isJapanese: boolean;
}

export default function PriceTable({ card, isJapanese }: PriceTableProps) {
  // Store the grade name of the expanded row
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (gradeName: string) => {
    if (expandedRow === gradeName) {
      setExpandedRow(null);
    } else {
      setExpandedRow(gradeName);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatUsd = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Safe checks
  if (!card) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md px-4 py-6 md:p-8 space-y-6">
      
      {/* Card Information Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-slate-800/80">
        
        {/* Card Image */}
        <div className="relative group w-40 h-56 md:w-44 md:h-60 flex-shrink-0 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/60 shadow-lg shadow-indigo-500/5">
          {card.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={card.imageUrl}
              alt={card.nameKr}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
              <ImageIcon size={40} />
              <span className="text-xs">이미지 준비 중</span>
            </div>
          )}
          {/* Rarity Tag */}
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur border border-slate-800 text-[10px] font-bold text-indigo-400 rounded">
            {card.rarity}
          </span>
        </div>

        {/* Card Metadata */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-400 tracking-wider">
              {card.id} | 고유 번호: {card.number}
            </span>
            <h2 className="text-2xl font-black text-white leading-tight tracking-wide">
              {isJapanese ? card.nameJp : card.nameKr}
            </h2>
            <p className="text-slate-400 text-xs font-medium">
              English: {card.nameEn}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 rounded-full text-xs font-bold">
              <Sparkles size={12} className="text-indigo-400 animate-spin" />
              <span>실시간 시세 업데이트 완료</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/25 rounded-full text-xs font-bold">
              <TrendingUp size={12} className="text-purple-400" />
              <span>최저가 플랫폼 자동매칭</span>
            </span>
          </div>
        </div>
      </div>

      {/* Integrated Price Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>등급 (Grade)</span>
          <span className="text-right">시세 (Market Price)</span>
        </div>

        <div className="space-y-2">
          {card.grades.map((gradeData, index) => {
            const isExpanded = expandedRow === gradeData.grade;
            
            // Insert mid-ad banner inside the table
            const insertAd = index === 3; 

            return (
              <React.Fragment key={gradeData.grade}>
                {/* Grade Row */}
                <div
                  onClick={() => toggleRow(gradeData.grade)}
                  className={`flex flex-col rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isExpanded
                      ? "bg-indigo-950/20 border-indigo-500/30 shadow-md shadow-indigo-500/5"
                      : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700/60"
                  }`}
                >
                  <div className="flex items-center justify-between px-5 py-4 select-none">
                    {/* Grade Name with highlight for Raw or PSA 10 / Rarity HR */}
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        index === 0 
                          ? "bg-slate-400" // Raw
                          : index === 1 
                          ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" // PSA 10 / Top grade
                          : "bg-indigo-500/60"
                      }`} />
                      <span className={`font-bold text-sm tracking-wide ${
                        index === 0 
                          ? "text-slate-300" 
                          : index === 1 
                          ? "text-amber-400" 
                          : "text-slate-200"
                      }`}>
                        {gradeData.grade}
                      </span>
                    </div>

                    {/* Price and Chevron */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-extrabold text-base text-white">
                          {formatCurrency(gradeData.priceKrw)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {formatUsd(gradeData.priceUsd)}
                        </div>
                      </div>
                      
                      <ChevronDown
                        size={18}
                        className={`text-slate-500 transition-transform duration-300 ${
                          isExpanded ? "transform rotate-180 text-indigo-400" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Sliding/Collapsible Chart container */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isExpanded
                        ? "max-h-[360px] opacity-100 border-t border-indigo-500/20"
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    {isExpanded && (
                      <div className="p-4 bg-slate-950/30">
                        <PriceChart data={gradeData.history30d} gradeName={gradeData.grade} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Render Middle Ad Banner inside the list */}
                {insertAd && <AdBanner position="middle" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
}
