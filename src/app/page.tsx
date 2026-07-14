"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import ImageSearch from "@/components/ImageSearch";
import PriceTable from "@/components/PriceTable";
import AdBanner from "@/components/AdBanner";
import AffiliateButtons from "@/components/AffiliateButtons";
import { fetchPokemonCardPrices, PokemonCard, pokemonSetList } from "@/lib/pokemonData";
import { Sparkles, TrendingUp, HelpCircle, Loader2, ArrowRight, Layers } from "lucide-react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isJapanese, setIsJapanese] = useState(false);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Handler for search submissions (supports optional page index)
  const handleSearch = async (searchQuery: string, targetPage: number = 1) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError("");
    
    // Maintain active query
    setQuery(searchQuery);

    try {
      const results = await fetchPokemonCardPrices(searchQuery, isJapanese, targetPage);
      
      setCards(results.cards);
      setCurrentPage(results.page);
      setTotalCount(results.totalCount);
      setTotalPages(results.totalPages);

      if (results.cards.length === 0) {
        setError(`"${searchQuery}"에 매칭되는 카드 시세 정보를 찾을 수 없습니다. 고유 번호(예: 349/190) 또는 영어로 입력해 보세요!`);
      }
    } catch (err: any) {
      console.error("Search Action Error:", err);
      setError(`카드 정보를 불러오지 못했습니다. (원인: ${err.message || "서버 혹은 네트워크 통신 실패"})`);
      // Reset card displays on actual crash/network failure
      setCards([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when toggling Japanese flag so the grades recalculate correctly (reset to page 1)
  useEffect(() => {
    if (query) {
      handleSearch(query, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJapanese]);

  // Initial check for URL query parameter 'q'
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get("q");
      if (qParam) {
        handleSearch(qParam);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Predefined trending search terms
  const trendingKeywords = [
    { label: "샤이니 리자몽 ex (SAR)", val: "349/190" },
    { label: "피카츄 ex (SAR)", val: "114/100" },
    { label: "뮤츠 (AR)", val: "134/108" },
    { label: "Charizard", val: "Charizard" },
    { label: "Pikachu", val: "Pikachu" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col pb-16">
      
      {/* Top Header Section */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                PokéPrice
              </h1>
              <p className="text-[10px] text-indigo-400/80 font-bold -mt-0.5 tracking-wide">카드 시세 분석 트래커</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">실시간 시세</span>
            <span className="hover:text-white transition-colors cursor-pointer hidden sm:inline">등급 가이드</span>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded-lg">
              Beta v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Top Ad Banner */}
      <AdBanner position="top" />

      {/* Hero Header Title */}
      <div className="max-w-4xl mx-auto text-center px-4 pt-4 pb-2 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">
          포켓몬 카드 시세를 실시간으로 확인하세요
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          국문 검색어도 다국어 매핑 및 자동 번역을 통해 해외 거래소 시세를 정확히 트래킹합니다. 한글판/일본판 맞춤 등급표를 한눈에 비교해 보세요.
        </p>
      </div>

      {/* Main Search Component */}
      <div className="my-6 space-y-4">
        <SearchBar
          onSearch={handleSearch}
          isJapanese={isJapanese}
          setIsJapanese={setIsJapanese}
        />
        <ImageSearch onSearch={handleSearch} />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={40} className="text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm animate-pulse">해외 시세 데이터베이스 동기화 중...</p>
        </div>
      )}

      {/* Empty State / Suggestions */}
      {!loading && !query && (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-6 md:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-indigo-400 border border-slate-800">
              <HelpCircle size={28} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-200">조회하고 싶은 포켓몬 카드를 검색해 보세요</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                이름 검색(예: 리자몽, 피카츄)이나 카드 오른쪽 구석에 표시된 고유 일련번호(예: 349/190)로 검색 시 해외 API 및 옥션 데이터를 결합하여 분석합니다.
              </p>
            </div>

            {/* Trending Search Shortcuts */}
            <div className="space-y-3 max-w-lg mx-auto">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-wider">실시간 인기 검색어</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {trendingKeywords.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      handleSearch(item.val);
                      // Set search input value in UI by triggering handleSearch directly
                    }}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Card Packs/Sets Section */}
            <div className="space-y-4 max-w-2xl mx-auto pt-4 border-t border-slate-800/40">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Layers size={14} className="text-indigo-400" />
                <span>실시간 인기 카드팩 (팩 전체 카드 보기)</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {pokemonSetList.map((set) => (
                  <button
                    key={set.id}
                    onClick={() => {
                      handleSearch(set.kr);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-950/20 hover:bg-indigo-950/50 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span>🇰🇷 {set.kr}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({set.id.toUpperCase()})</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="bg-rose-950/20 border border-rose-500/20 text-rose-200 p-6 rounded-2xl text-center text-sm space-y-3">
            <p>{error}</p>
            <button
              onClick={() => handleSearch("리자몽")}
              className="text-xs font-bold text-indigo-400 hover:underline"
            >
              인기 카드 "리자몽" 시세 예시 보러가기 →
            </button>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {!loading && query && cards.length > 0 && (
        <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
          {/* Total Results Summary Header */}
          <div className="w-full px-6 flex items-center justify-between text-xs text-slate-400 font-bold bg-slate-950/30 py-3 rounded-2xl border border-slate-900 shadow-inner">
            <span>검색결과: 총 {totalCount}개</span>
            <span>페이지: {currentPage} / {totalPages}</span>
          </div>

          {/* Grid-to-Table Container */}
          <div className="w-full overflow-hidden bg-slate-900/20 border border-slate-800/80 rounded-3xl backdrop-blur-md shadow-2xl">
            <div className="w-full">
              <table className="w-full text-left border-collapse block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-bold text-indigo-300 uppercase tracking-wider md:table-row">
                    <th className="px-6 py-4 md:table-cell">카드 사진</th>
                    <th className="px-6 py-4 md:table-cell">포켓몬 이름</th>
                    <th className="px-6 py-4 md:table-cell">카드 등급 (Rarity)</th>
                    <th className="px-6 py-4 text-right md:table-cell">현재 가격 (Raw)</th>
                  </tr>
                </thead>
                {cards.map((card) => (
                  <PriceTable key={card.id} card={card} isJapanese={isJapanese} />
                ))}
              </table>
            </div>
          </div>

          {/* Pagination Navigation Controller */}
          {totalPages > 1 && (() => {
            // Helper to generate dynamic sliding window of page numbers
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            if (endPage - startPage + 1 < maxVisiblePages) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            const pageNumbers = [];
            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(i);
            }

            return (
              <div className="w-full px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-lg backdrop-blur">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handleSearch(query, currentPage - 1)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currentPage === 1
                      ? "bg-slate-950/20 border-slate-900 text-slate-600 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  이전 페이지
                </button>

                {/* Clickable Page Numbers */}
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {pageNumbers.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handleSearch(query, pageNumber)}
                      className={`w-8 h-8 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center ${
                        currentPage === pageNumber
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20 scale-105"
                          : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handleSearch(query, currentPage + 1)}
                  className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currentPage === totalPages
                      ? "bg-slate-950/20 border-slate-900 text-slate-600 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  다음 페이지
                </button>
              </div>
            );
          })()}

          {/* Affiliate buttons for the current query */}
          <AffiliateButtons searchQuery={query} />
        </div>
      )}

      {/* Bottom Ad Banner */}
      <AdBanner position="bottom" />

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center px-4 pt-12 text-xs text-slate-500 space-y-2">
        <p>© 2026 PokéPrice Tracker. All rights reserved.</p>
        <p className="max-w-md mx-auto leading-relaxed">
          본 사이트는 포켓몬 컴퍼니, 닌텐도, 크리쳐스, 게임프리크 등 관련 라이선스 소유자와 관련이 없는 비공식 팬 사이트입니다. 시세는 거래소 거래 내역 기반으로 산출된 추정치로, 실제 거래 시점 및 매물 상태에 따라 다를 수 있습니다.
        </p>
      </footer>

    </main>
  );
}
