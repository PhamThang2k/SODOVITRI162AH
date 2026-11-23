import React, { useState } from 'react';
import { Delegate, HallZone } from '../types';
import { HALL_ZONES } from '../mockData';
import { MapPin, Users, Sparkles, Award, Shield, ChevronRight } from 'lucide-react';

interface HallMapProps {
  delegates: Delegate[];
  selectedDelegateId?: string;
  onSelectDelegate: (id: string) => void;
}

export function HallMap({ delegates, selectedDelegateId, onSelectDelegate }: HallMapProps) {
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const selectedDelegate = delegates.find(d => d.id === selectedDelegateId);

  const filteredDelegates = selectedZone === 'all'
    ? delegates
    : delegates.filter(d => {
        if (selectedZone === 'zone-a') return d.hallSeat.zone.includes('Khu vực A');
        if (selectedZone === 'zone-b') return d.hallSeat.zone.includes('Khu vực B');
        if (selectedZone === 'zone-c') return d.hallSeat.zone.includes('Khu vực C');
        if (selectedZone === 'zone-d') return d.hallSeat.zone.includes('Khu vực D');
        return true;
      });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" /> Sơ đồ bố trí trực quan
          </div>
          <h2 className="text-2xl font-black tracking-tight">HỘI TRƯỜNG CHÍNH - LỄ ĐÓN NHẬN ANH HÙNG LLVTND</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Sơ đồ được thiết kế trang nghiêm với khu vực Bục danh dự trung tâm, Đoàn chủ tịch và các khối đại biểu Quân chủng, Vùng 4, Lữ đoàn 162 và khách mời.
          </p>
        </div>

        {/* Zone Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedZone === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tất cả khu vực
          </button>
          {HALL_ZONES.map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedZone === z.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {z.name.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Auditorium Visual Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map Diagram Canvas */}
        <div className="lg:col-span-2 bg-slate-950 rounded-3xl border-2 border-slate-800 p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
          
          {/* Stage Header */}
          <div className="w-full max-w-lg bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 border-2 border-amber-500/60 rounded-2xl p-4 text-center shadow-lg mb-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-widest shadow">
              SÂN KHẤU CHÍNH & ĐOÀN CHỦ TỊCH
            </div>
            <h3 className="text-white font-extrabold text-sm tracking-wider mt-1">
              PHÔNG CHÍNH: LỮ ĐOÀN 162 ANH HÙNG LỰC LƯỢNG VŨ TRANG NHÂN DÂN
            </h3>
            <p className="text-[11px] text-amber-300 font-medium">
              Bục phát biểu • Quân kỳ quyết thắng • Tượng Bác Hồ
            </p>
          </div>

          {/* Seat Layout Blocks */}
          <div className="w-full space-y-6 relative py-4">
            
            {/* Zone A - VIP Center */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${
              selectedZone === 'all' || selectedZone === 'zone-a'
                ? 'bg-blue-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/40 border-slate-800 opacity-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-400 uppercase">
                  ⭐ Khu vực A - Bục danh dự trung tâm (Thủ trưởng BQP & Quân chủng)
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Hàng 1 - 2</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {delegates
                  .filter(d => d.hallSeat.zone.includes('Khu vực A'))
                  .map(d => {
                    const isSelected = d.id === selectedDelegateId;
                    return (
                      <button
                        key={d.id}
                        onClick={() => onSelectDelegate(d.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-white shadow-lg ring-2 ring-amber-400 scale-105'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200">
                            {d.hallSeat.seatNumber}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${d.checkedIn ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        </div>
                        <div className="text-xs font-bold truncate">{d.name}</div>
                        <div className="text-[10px] opacity-80 truncate">{d.title}</div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Zone B & D Side Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Zone B */}
              <div className={`p-4 rounded-2xl border transition-all ${
                selectedZone === 'all' || selectedZone === 'zone-b'
                  ? 'bg-blue-950/30 border-blue-500/50'
                  : 'bg-slate-900/40 border-slate-800 opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-300 uppercase">
                    Khu vực B - Quân chủng & Vùng 4
                  </span>
                </div>
                <div className="space-y-2">
                  {delegates
                    .filter(d => d.hallSeat.zone.includes('Khu vực B'))
                    .map(d => {
                      const isSelected = d.id === selectedDelegateId;
                      return (
                        <div
                          key={d.id}
                          onClick={() => onSelectDelegate(d.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-white shadow-lg'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold">{d.name}</div>
                            <div className="text-[10px] opacity-80">{d.title}</div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200">
                            {d.hallSeat.seatNumber}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Zone D */}
              <div className={`p-4 rounded-2xl border transition-all ${
                selectedZone === 'all' || selectedZone === 'zone-d'
                  ? 'bg-indigo-950/30 border-indigo-500/50'
                  : 'bg-slate-900/40 border-slate-800 opacity-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-300 uppercase">
                    Khu vực D - Khách mời Tỉnh ủy
                  </span>
                </div>
                <div className="space-y-2">
                  {delegates
                    .filter(d => d.hallSeat.zone.includes('Khu vực D'))
                    .map(d => {
                      const isSelected = d.id === selectedDelegateId;
                      return (
                        <div
                          key={d.id}
                          onClick={() => onSelectDelegate(d.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-white shadow-lg'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold">{d.name}</div>
                            <div className="text-[10px] opacity-80">{d.title}</div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-900 text-indigo-200">
                            {d.hallSeat.seatNumber}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

            {/* Zone C - Brigade 162 */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${
              selectedZone === 'all' || selectedZone === 'zone-c'
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg'
                : 'bg-slate-900/40 border-slate-800 opacity-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase">
                  ⚓ Khu vực C - Khối Đơn vị Anh hùng (Lữ đoàn 162 & Các Kíp Tàu)
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Hàng 1 - 6</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {delegates
                  .filter(d => d.hallSeat.zone.includes('Khu vực C'))
                  .map(d => {
                    const isSelected = d.id === selectedDelegateId;
                    return (
                      <button
                        key={d.id}
                        onClick={() => onSelectDelegate(d.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-white shadow-lg ring-2 ring-amber-400 scale-105'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200">
                            {d.hallSeat.seatNumber}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${d.checkedIn ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        </div>
                        <div className="text-xs font-bold truncate">{d.name}</div>
                        <div className="text-[10px] opacity-80 truncate">{d.title}</div>
                      </button>
                    );
                  })}
              </div>
            </div>

          </div>

        </div>

        {/* Selected Delegate Hall Seat Details Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-amber-500/30 p-6 text-white shadow-xl sticky top-24">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                📍
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Thông Tin Ghế Hội Trường
                </h3>
                <p className="text-xs text-slate-400">Chọn đại biểu trên sơ đồ để xem chi tiết</p>
              </div>
            </div>

            {selectedDelegate ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Họ và tên đại biểu</span>
                  <div className="text-lg font-black text-white">{selectedDelegate.name}</div>
                  <div className="text-xs text-amber-300 font-semibold">{selectedDelegate.title}</div>
                  <div className="text-xs text-slate-400">{selectedDelegate.unit}</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Khu vực:</span>
                    <span className="text-xs font-bold text-blue-400 text-right">{selectedDelegate.hallSeat.zone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Hàng ghế:</span>
                    <span className="text-sm font-mono font-extrabold text-amber-400">{selectedDelegate.hallSeat.row}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Số ghế định vị:</span>
                    <span className="text-sm font-mono font-extrabold text-emerald-400">{selectedDelegate.hallSeat.seatNumber}</span>
                  </div>
                </div>

                <div className="bg-blue-950/40 p-3.5 rounded-xl border border-blue-900/50 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lưu ý đón tiếp:</span>
                  </div>
                  <p>Đại biểu có lối đi riêng tại cửa chính hội trường. Đồng chí tổ lễ tân trực sẵn tại vị trí.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
                <p className="text-sm">Chưa chọn đại biểu nào.<br />Vui lòng click vào một đại biểu trên sơ đồ.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
