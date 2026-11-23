import React, { useState, useEffect } from 'react';
import { Delegate } from '../types';
import { Anchor, MapPin, Award, CheckCircle2, QrCode, UserCheck, Phone, ArrowRight, ShieldCheck, Printer, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DelegateScanViewProps {
  delegates: Delegate[];
  selectedDelegateId?: string;
  onSelectDelegate: (id: string) => void;
  onOpenInvitationModal: (delegate: Delegate) => void;
}

export function DelegateScanView({
  delegates,
  selectedDelegateId,
  onSelectDelegate,
  onOpenInvitationModal,
}: DelegateScanViewProps) {
  // If URL has ?delegate=id or prop is set
  const [currentId, setCurrentId] = useState<string>(
    selectedDelegateId || delegates[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check URL search params
    const params = new URLSearchParams(window.location.search);
    const delParam = params.get('delegate');
    if (delParam && delegates.some(d => d.id === delParam)) {
      setCurrentId(delParam);
    } else if (selectedDelegateId) {
      setCurrentId(selectedDelegateId);
    }
  }, [selectedDelegateId, delegates]);

  const activeDelegate = delegates.find(d => d.id === currentId) || delegates[0];

  const filteredDelegates = delegates.filter(
    d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Simulation Bar */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 mb-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                Mô Phỏng Quét Mã QR Thiệp Mời
              </h2>
              <p className="text-xs text-slate-300">
                Chọn đại biểu bên dưới hoặc quét mã QR trên thiệp mời để xem ngay vị trí chỗ ngồi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={currentId}
              onChange={(e) => {
                setCurrentId(e.target.value);
                onSelectDelegate(e.target.value);
                // Update URL parameter without reload
                const newUrl = `${window.location.pathname}?delegate=${e.target.value}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
              }}
              className="bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-500 w-full md:w-72 shadow-inner"
            >
              {delegates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeDelegate && (
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 rounded-3xl border-2 border-amber-500/40 shadow-2xl overflow-hidden relative">
          {/* Top Navy Warship Decorative Header */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 p-6 md:p-8 border-b border-amber-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-red-600 to-amber-400"></div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400/60 mb-3 shadow-lg shadow-amber-500/20">
              <Anchor className="w-9 h-9 text-amber-400" />
            </div>

            <div className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">
              LỮ ĐOÀN 162 - ANH HÙNG LLVTND
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              THẺ TRA CỨU CHỖ NGỒI ĐẠI BIỂU
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
              Lễ Đón Nhận Danh Hiệu Anh Hùng Lực Lượng Vũ Trang Nhân Dân & Kỷ Niệm Ngày Truyền Thống
            </p>

            {/* Delegate Badge Card */}
            <div className="mt-6 bg-slate-950/80 backdrop-blur border border-amber-500/30 rounded-2xl p-5 max-w-2xl mx-auto shadow-inner text-left flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeDelegate.category}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">
                  {activeDelegate.name}
                </h3>
                <p className="text-sm font-semibold text-amber-200">
                  {activeDelegate.title}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {activeDelegate.unit}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 shrink-0">
                <div className="bg-white p-2 rounded-lg shadow">
                  <QRCodeSVG
                    value={`${window.location.origin}/?delegate=${activeDelegate.id}`}
                    size={80}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">Mã QR Đại Biểu</span>
              </div>
            </div>
          </div>

          {/* Seat Details Grid */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hall Seat Card */}
              <div className="bg-slate-950/90 rounded-2xl p-6 border-2 border-blue-500/40 shadow-xl relative overflow-hidden group hover:border-blue-400 transition-all">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Phần 1
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-400 tracking-wider uppercase">
                      Vị Trí Trong Hội Trường
                    </h4>
                    <p className="text-lg font-black text-white">
                      {activeDelegate.hallSeat.zone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block mb-1">Hàng Ghế</span>
                    <span className="text-lg font-extrabold text-amber-400 font-mono">
                      {activeDelegate.hallSeat.row}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block mb-1">Số Ghế Định Vị</span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      {activeDelegate.hallSeat.seatNumber}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0"></span>
                  <span>Hướng dẫn: Lễ tân hội trường đón tiếp và dẫn vị trí tại Khu vực chính.</span>
                </div>
              </div>

              {/* Banquet Seat Card */}
              <div className="bg-slate-950/90 rounded-2xl p-6 border-2 border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-400 transition-all">
                <div className="absolute top-0 right-0 bg-amber-600 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3" /> Phần 2
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                      Vị Trí Trong Buổi Tiệc Mừng
                    </h4>
                    <p className="text-lg font-black text-white">
                      {activeDelegate.banquetSeat.table}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block mb-1">Bàn Tiệc Số</span>
                    <span className="text-lg font-extrabold text-amber-400 font-mono">
                      Bàn {activeDelegate.banquetSeat.tableNumber}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block mb-1">Ghế Ngồi</span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono">
                      {activeDelegate.banquetSeat.seatNumber}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 bg-amber-950/30 p-2.5 rounded-lg border border-amber-900/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span>
                  <span>Hướng dẫn: Tiệc mừng trọng thể tại Nhà ăn Chỉ huy Lữ đoàn 162.</span>
                </div>
              </div>

            </div>

            {/* Additional Notes & Action Buttons */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Lưu ý sự kiện</span>
                <p className="text-sm text-slate-200 font-medium">
                  {activeDelegate.notes || 'Đại biểu vui lòng có mặt trước giờ khai mạc 30 phút để ổn định chỗ ngồi và trang phục lễ phục theo quy định.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onOpenInvitationModal(activeDelegate)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs transition-transform transform active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Xem Thiệp & In QR</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
