import React, { useState } from 'react';
import { Delegate } from '../types';
import { QrCode, Printer, Anchor, MapPin, Award, Search, Shield } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CardsOverviewProps {
  delegates: Delegate[];
  onOpenInvitationModal: (delegate: Delegate) => void;
}

export function CardsOverview({ delegates, onOpenInvitationModal }: CardsOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = delegates.filter(
    d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" /> Xuất Mã QR & Thiệp Mời
          </div>
          <h2 className="text-2xl font-black tracking-tight">DANH SÁCH THIỆP MỜI & MÃ QR ĐẠI BIỂU</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Mỗi đại biểu sở hữu một mã QR riêng biệt. Khi quét bằng điện thoại, hệ thống tự động hiển thị chính xác vị trí chỗ ngồi Hội trường và Tiệc mừng.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đại biểu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(d => (
          <div
            key={d.id}
            className="bg-slate-950 border-2 border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full uppercase">
                  {d.category}
                </span>
                <span className="text-xs font-mono text-slate-400">ID: {d.id}</span>
              </div>

              <h3 className="text-lg font-black text-white mb-1">{d.name}</h3>
              <p className="text-xs font-bold text-amber-300 mb-1">{d.title}</p>
              <p className="text-xs text-slate-400 mb-4">{d.unit}</p>

              <div className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 space-y-2 mb-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> Hội trường:
                  </span>
                  <span className="font-bold text-white">{d.hallSeat.seatNumber} ({d.hallSeat.row})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" /> Tiệc mừng:
                  </span>
                  <span className="font-bold text-white">{d.banquetSeat.table} - {d.banquetSeat.seatNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="bg-white p-1.5 rounded-lg">
                <QRCodeSVG
                  value={`${window.location.origin}/?delegate=${d.id}`}
                  size={50}
                  level="M"
                  includeMargin={false}
                />
              </div>

              <button
                onClick={() => onOpenInvitationModal(d)}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Xem Thiệp & In</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
