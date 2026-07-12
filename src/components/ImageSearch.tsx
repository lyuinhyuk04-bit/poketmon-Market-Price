"use client";

import React, { useState, useRef } from "react";
import { Camera, Upload, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { createWorker } from "tesseract.js";
import { pokemonTranslationMap } from "@/lib/pokemonData";

interface ImageSearchProps {
  onSearch: (query: string) => void;
}

export default function ImageSearch({ onSearch }: ImageSearchProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse scanned text to find card numbers (e.g. 349/190), pokemon names, and rarity symbols (SAR, SR, AR)
  const parseOcrResult = (text: string): string | null => {
    const cleanText = text.toLowerCase();
    
    // 1. Detect if any rarity abbreviation is present
    const raritySymbols = ["sar", "ar", "sr", "ur", "hr", "rrr", "rr", "r", "u", "c"];
    let detectedRarity = "";
    
    for (const symbol of raritySymbols) {
      const rarityRegex = new RegExp(`\\b${symbol}\\b`, "i");
      if (rarityRegex.test(cleanText)) {
        detectedRarity = symbol.toUpperCase();
        break;
      }
    }

    // 2. Match card numbers (Format: 123/190 or 001/080)
    const numberRegex = /\b\d{1,3}\/\d{1,3}\b/;
    const numberMatch = text.match(numberRegex);
    if (numberMatch) {
      const cardNum = numberMatch[0];
      return detectedRarity ? `${cardNum} ${detectedRarity}` : cardNum;
    }

    // 3. Try to match popular English/Korean pokemon names
    const words = text.toLowerCase().replace(/[^a-z0-9]/g, " ").split(/\s+/);
    for (const word of words) {
      if (word.length < 3) continue;
      
      for (const [key, val] of Object.entries(pokemonTranslationMap)) {
        if (word === key || word === val.en.toLowerCase() || word === val.kr) {
          const pokemonName = val.kr; // search using Korean name
          return detectedRarity ? `${pokemonName} ${detectedRarity}` : pokemonName;
        }
      }
    }

    // 4. Fallback: extract the longest alphanumeric word with a slash
    const strippedText = text.replace(/[^a-zA-Z0-9\s/]/g, "").trim();
    const lines = strippedText.split("\n");
    for (const line of lines) {
      if (line.includes("/")) {
        const slashWord = line.split(" ").find(w => w.includes("/"));
        if (slashWord) {
          return detectedRarity ? `${slashWord} ${detectedRarity}` : slashWord;
        }
      }
    }

    return null;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setStatus("이미지 준비 중...");

    try {
      // 1. Create Tesseract Worker (Running completely client-side in browser, 0 cost)
      setStatus("인공지능 엔진 초기화 중...");
      const worker = await createWorker("eng");

      // 2. Perform OCR analysis
      setStatus("카드 텍스트 스캔 및 판독 중...");
      const ret = await worker.recognize(file);
      const text = ret.data.text;
      
      await worker.terminate();

      // 3. Parse parsed text
      setStatus("분석 정보 추출 중...");
      const matchedQuery = parseOcrResult(text);

      if (matchedQuery) {
        setStatus(`인식 성공: "${matchedQuery}"`);
        // Delay slightly for visual effect, then search
        setTimeout(() => {
          onSearch(matchedQuery);
          setLoading(false);
          setStatus("");
        }, 1200);
      } else {
        throw new Error("이미지에서 명확한 포켓몬 이름이나 카드 고유 번호(예: 349/190)를 인식하지 못했습니다. 글자가 뚜렷한 사진으로 다시 시도해 주세요.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "이미지 스캔 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-2">
      <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 space-y-4">
        
        {/* Layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
              <Camera size={16} className="text-indigo-400" />
              <span>사진 검색 (AI 카드 스캐너)</span>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-extrabold rounded border border-indigo-500/20">FREE</span>
            </h4>
            <p className="text-xs text-slate-400">
              카드 사진(이름이나 우측 하단 고유번호가 잘 보이는 정면 샷)을 업로드하면 자동으로 글자를 인식해 시세를 검색합니다.
            </p>
          </div>

          {/* Upload Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <button
              type="button"
              disabled={loading}
              onClick={triggerFileSelect}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                loading
                  ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:text-white"
              }`}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              <span>카드 사진 스캔하기</span>
            </button>
          </div>
        </div>

        {/* Scan Status & Scanner Animation overlay */}
        {loading && (
          <div className="relative overflow-hidden rounded-xl bg-slate-950/60 border border-indigo-500/20 p-5 flex flex-col items-center justify-center gap-3">
            {/* Visual Laser Scanner Line Effect */}
            <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_8px_rgba(99,102,241,0.8)] top-0 animate-[bounce_2s_infinite]" />
            
            <Loader2 size={24} className="text-indigo-400 animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-slate-300 animate-pulse">{status}</p>
              <p className="text-[10px] text-slate-500">기기 내 로컬 샌드박스에서 처리가 진행되어 안전하며 데이터 요금이 들지 않습니다.</p>
            </div>
          </div>
        )}

        {/* Scan Error Message */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-200 text-xs">
            <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
