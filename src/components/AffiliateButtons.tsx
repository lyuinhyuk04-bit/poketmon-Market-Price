"use client";

import React from "react";
import { ExternalLink, ShoppingCart, Search, RefreshCw } from "lucide-react";

interface AffiliateButtonsProps {
  searchQuery: string;
}

export default function AffiliateButtons({ searchQuery }: AffiliateButtonsProps) {
  // Safe fallback if search query is empty
  const query = searchQuery || "포켓몬 카드";
  
  // Append negative search operators to filter out binder, album, storage case, and toploader products
  // This ensures users only see actual collectible card listings on shopping platforms.
  const filterKeywords = `${query} -바인더 -보관 -앨범 -케이스 -탑로더`;
  const encodedQuery = encodeURIComponent(query);
  const encodedFilteredQuery = encodeURIComponent(filterKeywords);

  // Affiliate URL configurations
  // 1. Coupang partners lowest price link (Using filtered query)
  const partnersId = "AF9998887";
  const coupangUrl = `https://link.coupang.com/re/AFFSDP?lptag=${partnersId}&subid=pokeprice&pageKey=search&q=${encodedFilteredQuery}`;
  
  // 2. Naver Shopping lowest price comparison link (Using filtered query)
  const naverUrl = `https://search.shopping.naver.com/search/all?query=${encodedFilteredQuery}`;
  
  // 3. Bunjang real-time second-hand listings (Using filtered query)
  const bunjangUrl = `https://m.bunjang.co.kr/search/products?q=${encodedFilteredQuery}`;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-8">
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h4 className="text-slate-200 font-bold text-base flex items-center gap-2">
            <ShoppingCart size={18} className="text-indigo-400" />
            <span>국내 최저가 비교 및 매물 찾기</span>
          </h4>
          <p className="text-slate-400 text-xs">
            현재 검색어 <strong className="text-indigo-300">"{query}"</strong>로 연동된 국내 플랫폼 바로가기 링크입니다.
          </p>
        </div>

        {/* Grid of Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Coupang Button */}
          <a
            href={coupangUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl bg-orange-950/20 border border-orange-500/20 hover:border-orange-500/40 text-orange-200 hover:text-white transition-all hover:bg-orange-950/30 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                <ShoppingCart size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-orange-400">파트너스 최저가</div>
                <div className="text-sm font-bold">쿠팡 최저가 검색</div>
              </div>
            </div>
            <ExternalLink size={16} className="text-orange-500/60 group-hover:text-orange-400 transition-colors" />
          </a>

          {/* Naver Shopping Button */}
          <a
            href={naverUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-200 hover:text-white transition-all hover:bg-emerald-950/30 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Search size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-emerald-400">네이버 가격비교</div>
                <div className="text-sm font-bold">네이버 쇼핑 검색</div>
              </div>
            </div>
            <ExternalLink size={16} className="text-emerald-500/60 group-hover:text-emerald-400 transition-colors" />
          </a>

          {/* Bunjang Button */}
          <a
            href={bunjangUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl bg-red-950/20 border border-red-500/20 hover:border-red-500/40 text-red-200 hover:text-white transition-all hover:bg-red-950/30 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <RefreshCw size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-red-400">번장 실시간 시세</div>
                <div className="text-sm font-bold">번개장터 매물 조회</div>
              </div>
            </div>
            <ExternalLink size={16} className="text-red-500/60 group-hover:text-red-400 transition-colors" />
          </a>

        </div>

        {/* Partners Disclaimer */}
        <p className="text-[10px] text-slate-500 text-right italic">
          * 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>
    </div>
  );
}
