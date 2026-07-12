"use client";

import React, { useState, useEffect } from "react";
import { Search, Globe, AlertCircle } from "lucide-react";
import { translateQuery } from "@/lib/pokemonData";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isJapanese: boolean;
  setIsJapanese: (val: boolean) => void;
}

export default function SearchBar({ onSearch, isJapanese, setIsJapanese }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [translationTip, setTranslationTip] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
  };

  // Papago translation emulator helper
  useEffect(() => {
    if (input.trim().length > 1) {
      const { translated, language } = translateQuery(input);
      if (language === "kr" && translated !== input) {
        setTranslationTip(`Papago 번역기: "${input}" → 일본판/해외 검색어: "${translated}"`);
      } else {
        setTranslationTip("");
      }
    } else {
      setTranslationTip("");
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 px-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary transition-colors">
          <Search size={22} />
        </div>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="카드 이름(예: 리자몽, Pikachu) 또는 카드 고유번호(예: 349/190)를 입력하세요..."
          className="w-full pl-12 pr-28 py-4 bg-slate-900/60 backdrop-blur-md text-white border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-brand-primary transition-all shadow-lg placeholder:text-slate-500 text-lg"
        />

        <button
          type="submit"
          className="absolute right-2 top-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-md active:scale-95"
        >
          검색
        </button>
      </form>

      {/* Translation & Suggestion Banner */}
      {translationTip && (
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-indigo-300 text-sm animate-pulse">
          <Globe size={16} />
          <span>{translationTip}</span>
        </div>
      )}

      {/* Quick Search Helper Tip */}
      <div className="flex items-center gap-2 text-slate-400 text-xs px-2">
        <AlertCircle size={14} className="text-amber-500" />
        <span>해외 시세 API 연동을 위해 <strong>카드 구석의 고유 번호(예: 349/190)</strong>로 검색하시면 가장 정확한 시세를 조회할 수 있습니다.</span>
      </div>

      {/* Country / Market Toggle Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-slate-300 font-semibold text-lg flex items-center gap-2">
          <span>시장 선택</span>
          <span className="text-xs text-indigo-400 font-normal">| 원하는 국가의 카드 등급 체계로 시세를 확인합니다.</span>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-inner w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsJapanese(false)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
              !isJapanese
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <span className="text-xl">🇰🇷</span>
            <span>한글판 시세표</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsJapanese(true)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
              isJapanese
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/35 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <span className="text-xl">🇯🇵</span>
            <span>일본판 시세표</span>
          </button>
        </div>
      </div>
    </div>
  );
}
