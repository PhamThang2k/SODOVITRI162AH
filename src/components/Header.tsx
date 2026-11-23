import { Anchor, Award, Users, MapPin, QrCode, Shield, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'admin' | 'hall' | 'banquet' | 'scan' | 'cards';
  setActiveTab: (tab: 'admin' | 'hall' | 'banquet' | 'scan' | 'cards') => void;
  delegateCount: number;
  checkedInCount: number;
}

export function Header({ activeTab, setActiveTab, delegateCount, checkedInCount }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white shadow-2xl border-b border-amber-500/30 sticky top-0 z-50">
      {/* Top Banner Stripe */}
      <div className="bg-amber-600/20 border-b border-amber-500/20 py-1.5 px-4 text-xs font-semibold text-amber-300 tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <span>HỆ THỐNG ĐIỀU HÀNH & TRA CỨU SƠ ĐỒ GHẾ NGỒI ĐẠI BIỂU - LỄ ĐÓN NHẬN ANH HÙNG LLVTND</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-300">
          <span>Tổng số đại biểu: <strong className="text-amber-300">{delegateCount}</strong></span>
          <span>Đã check-in: <strong className="text-emerald-400">{checkedInCount}</strong></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 flex items-center justify-center shadow-lg shadow-amber-500/25 border-2 border-amber-300/50 shrink-0 transform hover:scale-105 transition-transform">
            <Anchor className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-red-400 shadow-sm">
                Vùng 4 Hải Quân
              </span>
              <span className="text-amber-400 font-mono text-xs font-bold tracking-wider">
                ĐƠN VỊ ANH HÙNG
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              LỮ ĐOÀN 162 <span className="text-amber-400 font-serif font-normal text-lg">TÀU CHIẾN HIỆN ĐẠI</span>
            </h1>
            <p className="text-xs text-slate-300 tracking-wide font-medium">
              Lễ Đón Nhận Danh Hiệu Anh Hùng Lực Lượng Vũ Trang Nhân Dân
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Đại Biểu & Quản Lý</span>
          </button>

          <button
            onClick={() => setActiveTab('hall')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === 'hall'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Sơ Đồ Hội Trường</span>
          </button>

          <button
            onClick={() => setActiveTab('banquet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === 'banquet'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Sơ Đồ Tiệc Mừng</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === 'scan'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Quét QR / Tra Cứu</span>
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === 'cards'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Mẫu Thiệp & QR</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
