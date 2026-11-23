import React from 'react';
import { Delegate } from '../types';
import { Anchor, MapPin, Award, X, Printer, QrCode, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface InvitationCardModalProps {
  delegate: Delegate | null;
  onClose: () => void;
}

export function InvitationCardModal({ delegate, onClose }: InvitationCardModalProps) {
  if (!delegate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest border border-red-400">
            THIỆP MỜI & MÃ QR ĐẠI BIỂU
          </span>
          <h3 className="text-xl font-black mt-2">LỮ ĐOÀN 162 - ANH HÙNG LLVTND</h3>
          <p className="text-xs text-slate-300">Xem trước mẫu thiệp mời có đính kèm mã QR tra cứu chỗ ngồi</p>
        </div>

        {/* Printable Invitation Card Box */}
        <div id="printable-card" className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border-2 border-amber-400/60 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-red-600 to-amber-400"></div>
          
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow">
                <Anchor className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">QUÂN CHỦNG HẢI QUÂN</div>
                <h4 className="font-extrabold text-white text-sm">LỮ ĐOÀN TÀU CHIẾN 162</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-mono font-bold">
                MÃ: {delegate.id.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="text-center space-y-2 mb-6">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Trân trọng kính mời</span>
            <h3 className="text-2xl md:text-3xl font-black text-white">{delegate.name}</h3>
            <p className="text-sm font-bold text-amber-200">{delegate.title}</p>
            <p className="text-xs text-slate-300">{delegate.unit}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-2">
                <MapPin className="w-4 h-4" /> Hội Trường Chính
              </div>
              <div className="text-sm font-bold text-white">{delegate.hallSeat.zone}</div>
              <div className="text-xs font-mono text-amber-400 mt-1">
                {delegate.hallSeat.row} • Ghế {delegate.hallSeat.seatNumber}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-2">
                <Award className="w-4 h-4" /> Tiệc Mừng Trọng Thể
              </div>
              <div className="text-sm font-bold text-white">{delegate.banquetSeat.table}</div>
              <div className="text-xs font-mono text-emerald-400 mt-1">
                {delegate.banquetSeat.seatNumber}
              </div>
            </div>
          </div>

          {/* QR Code & Footer */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 justify-center md:justify-start">
                <QrCode className="w-4 h-4" /> Quét mã QR để xem sơ đồ trực tuyến
              </span>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Đưa camera điện thoại vào mã QR để nhận chỉ dẫn chi tiết chỗ ngồi Hội trường & Tiệc mừng.
              </p>
            </div>
            <div className="bg-white p-2.5 rounded-xl shadow-lg shrink-0">
              <QRCodeSVG
                value={`${window.location.origin}/?delegate=${delegate.id}`}
                size={90}
                level="M"
                includeMargin={false}
              />
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Đóng
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>In Thiệp & Mã QR</span>
          </button>
        </div>

      </div>
    </div>
  );
}
