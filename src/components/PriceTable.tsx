"use client";

import React, { useState } from "react";
import { PokemonCard } from "@/lib/pokemonData";
import PriceChart from "./PriceChart";
import { ChevronDown, Image as ImageIcon, Sparkles, TrendingUp, X } from "lucide-react";

interface PriceTableProps {
  card: PokemonCard;
  isJapanese: boolean;
}

export default function PriceTable({ card, isJapanese }: PriceTableProps) {
  // Toggle for accordion chart expansion
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Track selected grade to show chart for (defaults to the first grade, e.g., Raw)
  const [selectedGrade, setSelectedGrade] = useState<string>(
    card.grades && card.grades.length > 0 ? card.grades[0].grade : ""
  );

  // State to handle fullscreen card image zooming modal
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

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

  // Find the selected grade data for the chart
  const activeGradeData = card.grades.find((g) => g.grade === selectedGrade) || card.grades[0];

  // Default displayed price (usually the first grade in the list, e.g., Raw)
  const defaultGrade = card.grades[0];
  const displayPriceKrw = defaultGrade ? defaultGrade.priceKrw : 0;
  const displayPriceUsd = defaultGrade ? defaultGrade.priceUsd : 0;

  return (
    <tbody className="block md:table-row-group border-b border-slate-800/60 bg-slate-900/10 hover:bg-slate-900/20 transition-colors duration-200">
      
      {/* Primary Card Data Row */}
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col md:table-row px-4 py-4 md:px-0 md:py-0 cursor-pointer select-none active:bg-slate-900/40"
      >
        {/* Column 1: Card Image & Zoom Trigger */}
        <td className="block md:table-cell py-2 md:py-4 md:pl-6">
          <div className="flex md:block items-center gap-4">
            <div 
              onClick={(e) => {
                e.stopPropagation(); // Prevent row collapse toggle
                if (card.imageUrl) setZoomImageUrl(card.imageUrl);
              }}
              title="클릭 시 카드 이미지 크게 보기"
              className="relative group w-14 h-20 md:w-16 md:h-22 flex-shrink-0 bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 shadow-md hover:border-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-zoom-in"
            >
              {card.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={card.imageUrl}
                  alt={card.nameKr}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                  <ImageIcon size={18} />
                </div>
              )}
              {/* Hover Zoom Magnifying indicator */}
              <div className="absolute inset-0 bg-indigo-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <span className="text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-850 text-indigo-400 font-bold scale-90">ZOOM</span>
              </div>
            </div>
            {/* Mobile-only layout helper: Show title next to image on mobile */}
            <div className="block md:hidden flex-1 space-y-1">
              <h3 className="font-extrabold text-sm text-white tracking-wide leading-snug">
                {isJapanese ? card.nameJp : card.nameKr}
              </h3>
              <div className="mt-1">
                <span className="inline-block px-1.5 py-0.5 bg-slate-800/80 text-slate-300 rounded text-[9px] font-bold border border-slate-700">
                  📦 수록 팩: {card.setNameKr || "해외 부스터 팩"}
                </span>
              </div>
            </div>
          </div>
        </td>

        {/* Column 2: Card Name & Set Info (Hidden in mobile since it is rendered next to image) */}
        <td className="hidden md:table-cell px-4 py-4 md:px-6">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-sm md:text-base text-white tracking-wide leading-snug">
              {isJapanese ? card.nameJp : card.nameKr}
            </h3>
            <div>
              <span className="inline-block px-1.5 py-0.5 bg-slate-800/80 text-slate-300 rounded text-[9px] font-bold border border-slate-700">
                📦 수록 팩: {card.setNameKr || "해외 부스터 팩"}
              </span>
            </div>
          </div>
        </td>

        {/* Column 3: Card Rarity / Grade */}
        <td className="block md:table-cell py-2 md:py-4 md:px-6">
          <div className="flex md:flex-col gap-1.5 items-center md:items-start text-[10px]">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider">
              {card.rarity || "COMMON"}
            </span>
            <span className="text-[9px] md:text-[10px] text-slate-400 font-bold bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800">
              #{card.number}
            </span>
            {/* Mobile-only metadata labels */}
            <span className="block md:hidden text-[9px] text-slate-500 font-bold ml-auto">
              ID: {card.id}
            </span>
          </div>
        </td>

        {/* Column 4: Present Price & Toggle Chevron */}
        <td className="block md:table-cell py-2 md:py-4 md:px-6 text-right border-t border-slate-800/40 md:border-t-0 mt-2 md:mt-0">
          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
            {/* Mobile-only price label */}
            <span className="block md:hidden text-xs font-bold text-slate-500">현재 최저가 (Raw)</span>
            
            <div className="flex items-center gap-3">
              <div className="text-right space-y-0.5">
                {defaultGrade ? (
                  <>
                    <div className="text-base md:text-base font-black text-indigo-400">
                      {formatCurrency(displayPriceKrw)}
                    </div>
                    <div className="text-[10px] md:text-[10px] text-slate-500 font-bold">
                      {formatUsd(displayPriceUsd)} ({defaultGrade.grade})
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-500 font-bold">시세 정보 없음</span>
                )}
              </div>
              
              <ChevronDown
                size={16}
                className={`text-slate-500 transition-transform duration-300 ${
                  isExpanded ? "transform rotate-180 text-indigo-400" : ""
                }`}
              />
            </div>
          </div>
        </td>
      </tr>

      {/* Secondary Chart Accordion Row */}
      {isExpanded && (
        <tr className="block md:table-row bg-slate-950/40 border-t border-slate-800/40">
          <td colSpan={4} className="block md:table-cell px-4 py-6 md:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Header inside Chart box */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 rounded-full text-[10px] font-bold">
                    <Sparkles size={10} className="text-indigo-400 animate-spin" />
                    <span>시세 자동 매칭</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/25 rounded-full text-[10px] font-bold">
                    <TrendingUp size={10} className="text-purple-400" />
                    <span>최저가 추적 중</span>
                  </span>
                </div>

                {/* Grade Switcher Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {card.grades.map((gradeData) => (
                    <button
                      key={gradeData.grade}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row collapse
                        setSelectedGrade(gradeData.grade);
                      }}
                      className={`px-3 py-1 rounded-xl text-[10px] md:text-xs font-bold border transition-all cursor-pointer ${
                        selectedGrade === gradeData.grade
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20"
                          : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {gradeData.grade} ({formatCurrency(gradeData.priceKrw)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Component for Selected Grade */}
              {activeGradeData && (
                <div className="w-full overflow-hidden">
                  <PriceChart 
                    data={activeGradeData.history30d} 
                    gradeName={`${isJapanese ? card.nameJp : card.nameKr} [${activeGradeData.grade}]`} 
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      {/* Fullscreen Card Image Zoom Modal Overlay */}
      {zoomImageUrl && (
        <tr className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
            onClick={() => setZoomImageUrl(null)}>
          <td className="relative max-w-sm md:max-w-md w-full flex flex-col items-center gap-5">
            <div className="relative w-full max-h-[75vh] flex items-center justify-center select-none"
                 onClick={(e) => e.stopPropagation() /* Prevent close when clicking image */}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomImageUrl}
                alt="Expanded Pokemon Card hires artwork"
                className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-2xl shadow-[0_0_65px_rgba(99,102,241,0.4)] border border-slate-800/80"
              />
              {/* Quick Close Button top-right */}
              <button
                type="button"
                onClick={() => setZoomImageUrl(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setZoomImageUrl(null)}
              className="px-6 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-full text-xs font-bold shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              닫기 (이 영역 외 클릭 시도 닫힘)
            </button>
          </td>
        </tr>
      )}
    </tbody>
  );
}
