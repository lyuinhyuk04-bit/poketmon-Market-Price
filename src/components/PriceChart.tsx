"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

interface PriceHistoryItem {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PriceHistoryItem[];
  gradeName: string;
}

export default function PriceChart({ data, gradeName }: PriceChartProps) {
  const [period, setPeriod] = useState<"7d" | "30d">("30d");

  // Filter history based on 7 days or 30 days
  const filteredData = period === "7d" ? data.slice(-7) : data;

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Safe check if no data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        시세 추이 데이터가 존재하지 않습니다.
      </div>
    );
  }

  // Calculate stats
  const startPrice = filteredData[0]?.price || 0;
  const endPrice = filteredData[filteredData.length - 1]?.price || 0;
  const priceDiff = endPrice - startPrice;
  const priceDiffPercent = startPrice > 0 ? (priceDiff / startPrice) * 100 : 0;
  const isUp = priceDiff >= 0;

  return (
    <div className="p-5 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded border border-indigo-500/20">
              {gradeName}
            </span>
            <h4 className="text-slate-200 font-semibold text-sm">시세 변동 추이</h4>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">
              {formatCurrency(endPrice)}
            </span>
            <span className={`text-xs font-medium flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp size={12} className={isUp ? "" : "rotate-180"} />
              {isUp ? "+" : ""}{priceDiffPercent.toFixed(1)}% (
              {isUp ? "+" : ""}{formatCurrency(priceDiff)})
            </span>
          </div>
        </div>

        {/* Period Selector Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setPeriod("7d")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              period === "7d"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            최근 7일
          </button>
          
          <button
            type="button"
            onClick={() => setPeriod("30d")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              period === "30d"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            최근 30일
          </button>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toLocaleString()}k`}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                borderColor: "rgba(99, 102, 241, 0.4)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px"
              }}
              formatter={(value: any) => [formatCurrency(Number(value)), "시세"]}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Indicator */}
      <div className="flex items-center gap-1.5 justify-end text-slate-500 text-xs">
        <Calendar size={12} />
        <span>실시간 해외 거래 시세 거래 내역 기반 변동 추정</span>
      </div>
    </div>
  );
}
