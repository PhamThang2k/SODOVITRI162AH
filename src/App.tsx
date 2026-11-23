/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Anchor, MapPin, Award, Search, QrCode, FileSpreadsheet, Check, Download, Upload, RefreshCw, UserCheck, Users, MessageSquare } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as XLSX from 'xlsx';

interface Delegate {
  id: string;
  name: string;
  title: string;
  unit: string;
  hallLocation: string; // Format: "Hàng A, ghế 01"
  banquetLocation: string;
  rsvp?: 'yes' | 'no' | 'pending';
  familyCount?: number;
  familyNames?: string;
  note?: string;
}

const DEFAULT_DELEGATES: Delegate[] = [
  {
    id: '1',
    name: 'Đại tướng Phan Văn Giang',
    title: 'Bộ trưởng Bộ Quốc phòng',
    unit: 'Bộ Quốc phòng',
    hallLocation: 'Hàng A, ghế 01',
    banquetLocation: 'Bàn VIP 01 - Ghế số 01',
    rsvp: 'yes',
    familyCount: 0,
    familyNames: '',
    note: '',
  },
  {
    id: '2',
    name: 'Đô đốc Trần Đăng Minh',
    title: 'Tư lệnh Quân chủng Hải quân',
    unit: 'Bộ Tư lệnh Quân chủng',
    hallLocation: 'Hàng A, ghế 02',
    banquetLocation: 'Bàn VIP 01 - Ghế số 02',
    rsvp: 'yes',
    familyCount: 1,
    familyNames: 'Phu nhân đi cùng',
    note: 'Đã xác nhận',
  },
  {
    id: '3',
    name: 'Trung tướng Nguyễn Văn Bổng',
    title: 'Chính ủy Quân chủng Hải quân',
    unit: 'Bộ Tư lệnh Quân chủng',
    hallLocation: 'Hàng A, ghế 03',
    banquetLocation: 'Bàn VIP 01 - Ghế số 03',
    rsvp: 'pending',
    familyCount: 0,
    familyNames: '',
    note: '',
  },
  {
    id: '4',
    name: 'Đại tá Nguyễn Văn Dũng',
    title: 'Lữ đoàn trưởng Lữ đoàn 162',
    unit: 'Lữ đoàn 162, Vùng 4',
    hallLocation: 'Hàng C, ghế 01',
    banquetLocation: 'Bàn 03 - Ghế số 01',
    rsvp: 'yes',
    familyCount: 0,
    familyNames: '',
    note: '',
  },
  {
    id: '5',
    name: 'Thượng tá Lê Bá Hải',
    title: 'Chính ủy Lữ đoàn 162',
    unit: 'Lữ đoàn 162, Vùng 4',
    hallLocation: 'Hàng C, ghế 02',
    banquetLocation: 'Bàn 03 - Ghế số 02',
    rsvp: 'yes',
    familyCount: 0,
    familyNames: '',
    note: '',
  },
];

export default function App() {
  const [delegates, setDelegates] = useState<Delegate[]>(() => {
    const saved = localStorage.getItem('brigade162_delegates_v4');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_DELEGATES; }
    }
    return DEFAULT_DELEGATES;
  });

  const [selectedId, setSelectedId] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const del = params.get('delegate');
    return del || DEFAULT_DELEGATES[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  // RSVP Form local state for selected delegate
  const currentDelegate = delegates.find(d => d.id === selectedId) || delegates[0];
  
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | 'pending'>(currentDelegate?.rsvp || 'pending');
  const [familyCount, setFamilyCount] = useState<number>(currentDelegate?.familyCount || 0);
  const [familyNames, setFamilyNames] = useState<string>(currentDelegate?.familyNames || '');
  const [delegateNote, setDelegateNote] = useState<string>(currentDelegate?.note || '');

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentDelegate) {
      setRsvpStatus(currentDelegate.rsvp || 'pending');
      setFamilyCount(currentDelegate.familyCount || 0);
      setFamilyNames(currentDelegate.familyNames || '');
      setDelegateNote(currentDelegate.note || '');
    }
  }, [selectedId, delegates]);

  useEffect(() => {
    localStorage.setItem('brigade162_delegates_v4', JSON.stringify(delegates));
  }, [delegates]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const del = params.get('delegate');
    if (del && delegates.some(d => d.id === del)) {
      setSelectedId(del);
    }
  }, [delegates]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDelegates = delegates.filter(
    d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectDelegate = (id: string) => {
    setSelectedId(id);
    setIsDropdownOpen(false);
    setSearchQuery('');
    const newUrl = `${window.location.pathname}?delegate=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục danh sách mẫu mặc định?')) {
      setDelegates(DEFAULT_DELEGATES);
      setSelectedId(DEFAULT_DELEGATES[0].id);
      localStorage.setItem('brigade162_delegates_v4', JSON.stringify(DEFAULT_DELEGATES));
    }
  };

  // Save RSVP update for current delegate
  const handleSaveRsvp = () => {
    const updated = delegates.map(d => {
      if (d.id === currentDelegate.id) {
        return {
          ...d,
          rsvp: rsvpStatus,
          familyCount: rsvpStatus === 'yes' ? familyCount : 0,
          familyNames: rsvpStatus === 'yes' ? familyNames : '',
          note: delegateNote,
        };
      }
      return d;
    });
    setDelegates(updated);
    alert('Đã lưu xác nhận tham gia thành công!');
  };

  // Download Excel Template with RSVP columns
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Họ và tên": "Đại tướng Phan Văn Giang",
        "Chức vụ": "Bộ trưởng Bộ Quốc phòng",
        "Đơn vị": "Bộ Quốc phòng",
        "Vị trí hội trường": "Hàng A, ghế 01",
        "Vị trí bàn tiệc": "Bàn VIP 01 - Ghế số 01",
        "Xác nhận tham gia (Có/Không)": "Có",
        "Số người thân": 0,
        "Ghi chú người thân / Khác": "",
        "Ghi chú": "Đã xác nhận"
      },
      {
        "Họ và tên": "Đô đốc Trần Đăng Minh",
        "Chức vụ": "Tư lệnh Quân chủng Hải quân",
        "Đơn vị": "Bộ Tư lệnh Quân chủng",
        "Vị trí hội trường": "Hàng A, ghế 02",
        "Vị trí bàn tiệc": "Bàn VIP 01 - Ghế số 02",
        "Xác nhận tham gia (Có/Không)": "Có",
        "Số người thân": 1,
        "Ghi chú người thân / Khác": "Phu nhân đi cùng",
        "Ghi chú": ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "XacNhanThamGia");
    XLSX.writeFile(workbook, "Mau_Xac_Nhan_Tham_Gia_Lu_Doan_162.xlsx");
  };

  // Export current list to Excel including RSVP
  const handleExportExcel = () => {
    const exportData = delegates.map(d => ({
      "Họ và tên": d.name,
      "Chức vụ": d.title,
      "Đơn vị": d.unit,
      "Vị trí hội trường": d.hallLocation,
      "Vị trí bàn tiệc": d.banquetLocation,
      "Xác nhận tham gia": d.rsvp === 'yes' ? 'Có' : d.rsvp === 'no' ? 'Không' : 'Chưa xác nhận',
      "Số người thân đi cùng": d.familyCount || 0,
      "Tên / Ghi chú người thân": d.familyNames || '',
      "Ghi chú": d.note || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachXacNhan");
    XLSX.writeFile(workbook, `Danh_Sach_Xac_Nhan_Tham_Gia_L162_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Handle Excel File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (data.length > 0) {
          const parsedDelegates: Delegate[] = data.map((row, idx) => {
            const rsvpRaw = String(row['Xác nhận tham gia (Có/Không)'] || row['Xác nhận tham gia'] || row['Xac nhan tham gia'] || 'Chưa xác nhận').toLowerCase();
            const isYes = rsvpRaw.includes('có') || rsvpRaw.includes('yes') || rsvpRaw.includes('tham gia');
            const isNo = rsvpRaw.includes('không') || rsvpRaw.includes('ko') || rsvpRaw.includes('no');

            return {
              id: `excel-${Date.now()}-${idx}`,
              name: row['Họ và tên'] || row['Ho va ten'] || row['Name'] || `Đại biểu ${idx + 1}`,
              title: row['Chức vụ'] || row['Chuc vu'] || row['Title'] || 'Đại biểu',
              unit: row['Đơn vị'] || row['Don vi'] || row['Unit'] || 'Lữ đoàn 162',
              hallLocation: row['Vị trí hội trường'] || row['Vi tri hoi truong'] || row['Hall'] || 'Hàng B, ghế 01',
              banquetLocation: row['Vị trí bàn tiệc'] || row['Vi tri ban tiec'] || row['Banquet'] || 'Bàn 01 - Ghế số 01',
              rsvp: isYes ? 'yes' : isNo ? 'no' : 'pending',
              familyCount: Number(row['Số người thân'] || row['Số người thân đi cùng'] || 0),
              familyNames: String(row['Ghi chú người thân / Khác'] || row['Tên / Ghi chú người thân'] || ''),
              note: String(row['Ghi chú'] || ''),
            };
          });

          setDelegates(parsedDelegates);
          setSelectedId(parsedDelegates[0].id);
          setShowImportModal(false);
          alert(`Đã nhập thành công ${parsedDelegates.length} đại biểu từ file Excel!`);
        } else {
          alert('File Excel không có dữ liệu.');
        }
      } catch (err) {
        alert('Lỗi đọc file Excel. Vui lòng kiểm tra lại định dạng file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-amber-500/30 px-4 py-4 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                LỮ ĐOÀN 162 - VÙNG 4 HẢI QUÂN
              </div>
              <h1 className="text-lg md:text-xl font-extrabold text-white">
                TRA CỨU CHỖ NGỒI & XÁC NHẬN THAM GIA
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              title="Xuất danh sách ra Excel"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Nhập Excel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Search Bar with Autocomplete Dropdown */}
        <div className="relative" ref={searchRef}>
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-2 shadow-xl flex items-center gap-3">
            <Search className="w-5 h-5 text-amber-400 ml-3" />
            <input
              type="text"
              placeholder="Gõ tên đại biểu, chức vụ hoặc đơn vị để tìm kiếm..."
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm md:text-base focus:outline-none py-2"
            />
          </div>

          {/* Autocomplete Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-slate-800">
              {filteredDelegates.length > 0 ? (
                filteredDelegates.map(d => (
                  <div
                    key={d.id}
                    onClick={() => handleSelectDelegate(d.id)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between hover:bg-amber-500/10 ${
                      d.id === selectedId ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-extrabold text-white">{d.name}</div>
                      <div className="text-xs text-amber-400">{d.title} — <span className="text-slate-400">{d.unit}</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        d.rsvp === 'yes' ? 'bg-emerald-500/20 text-emerald-400' : d.rsvp === 'no' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {d.rsvp === 'yes' ? 'Tham gia' : d.rsvp === 'no' ? 'Không tham gia' : 'Chưa xác nhận'}
                      </span>
                      {d.id === selectedId && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Không tìm thấy đại biểu phù hợp.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delegate Seating Result Card */}
        {currentDelegate && (
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-red-600 to-amber-400"></div>

            {/* Delegate Info */}
            <div className="text-center space-y-1 border-b border-slate-800 pb-6">
              <span className="inline-block bg-amber-500/20 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
                Đại Biểu Chính Thức
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">{currentDelegate.name}</h2>
              <p className="text-base font-bold text-amber-400">{currentDelegate.title}</p>
              <p className="text-xs text-slate-300">{currentDelegate.unit}</p>
            </div>

            {/* Two Required Positions: Hall & Banquet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hall Position */}
              <div className="bg-slate-950 border-2 border-blue-500/40 rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-5 h-5" /> 1. Vị Trí Trong Hội Trường
                </div>
                <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-slate-400 block mb-1">Tọa độ chỗ ngồi:</span>
                  <div className="text-lg md:text-xl font-extrabold text-white font-mono">
                    {currentDelegate.hallLocation}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Đại biểu vui lòng ổn định đúng hàng ghế theo sự hướng dẫn của tổ lễ tân.
                </p>
              </div>

              {/* Banquet Position */}
              <div className="bg-slate-950 border-2 border-amber-500/40 rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-5 h-5" /> 2. Vị Trí Bàn Tiệc Mừng
                </div>
                <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-900/40">
                  <span className="text-xs text-slate-400 block mb-1">Tọa độ bàn tiệc:</span>
                  <div className="text-lg md:text-xl font-extrabold text-amber-300 font-mono">
                    {currentDelegate.banquetLocation}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tiệc mừng trọng thể tại Nhà ăn Chỉ huy Lữ đoàn sau buổi lễ.
                </p>
              </div>

            </div>

            {/* RSVP Section (Xác nhận tham gia & Người thân) */}
            <div className="bg-slate-950 border-2 border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <UserCheck className="w-5 h-5" /> Xác Nhận Tham Gia Lễ Đón Nhận
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('yes')}
                  className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                    rsvpStatus === 'yes'
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${rsvpStatus === 'yes' ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                    {rsvpStatus === 'yes' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span>Có tham gia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRsvpStatus('no')}
                  className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-sm transition-all ${
                    rsvpStatus === 'no'
                      ? 'bg-red-600/30 border-red-500 text-red-300 shadow-lg shadow-red-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${rsvpStatus === 'no' ? 'bg-red-500 border-red-400 text-slate-950' : 'border-slate-600'}`}>
                    {rsvpStatus === 'no' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </span>
                  <span>Không tham gia</span>
                </button>
              </div>

              {/* If YES: Family members & Notes */}
              {rsvpStatus === 'yes' && (
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Users className="w-4 h-4" /> Thông tin người thân đi cùng & ghi chú
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Số lượng người thân</label>
                      <input
                        type="number"
                        min={0}
                        max={5}
                        value={familyCount}
                        onChange={(e) => setFamilyCount(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Tên / Ghi chú người thân đi cùng</label>
                      <input
                        type="text"
                        placeholder="VD: Phu nhân Nguyễn Thị B"
                        value={familyNames}
                        onChange={(e) => setFamilyNames(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* General Note */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Ghi chú thêm (nếu có)</label>
                <input
                  type="text"
                  placeholder="VD: Đến muộn 15 phút do công tác..."
                  value={delegateNote}
                  onChange={(e) => setDelegateNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                onClick={handleSaveRsvp}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Lưu Xác Nhận Tham Gia</span>
              </button>
            </div>

            {/* QR Code Section */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 justify-center sm:justify-start">
                  <QrCode className="w-4 h-4" /> Mã QR Thiệp Mời Cá Nhân
                </span>
                <p className="text-[11px] text-slate-400">
                  Quét mã để mở trực tiếp trang tra cứu chỗ ngồi trên điện thoại.
                </p>
              </div>
              <div className="bg-white p-2 rounded-xl shadow">
                <QRCodeSVG
                  value={`${window.location.origin}/?delegate=${currentDelegate.id}`}
                  size={75}
                  level="M"
                  includeMargin={false}
                />
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Import / Export Excel Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-2 text-amber-400">
                <FileSpreadsheet className="w-6 h-6" />
                Tải Mẫu & Nhập File Excel
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Download Template */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Bước 1: Tải file mẫu Excel chuẩn (Gồm cột Xác nhận & Người thân)
              </span>
              <p className="text-xs text-slate-300">
                File mẫu có đầy đủ các cột: Họ tên, Chức vụ, Đơn vị, Vị trí hội trường, Vị trí bàn tiệc, Xác nhận tham gia, Số người thân, Ghi chú.
              </p>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Tải Xuống File Mẫu Excel (.xlsx)</span>
              </button>
            </div>

            {/* Step 2: Upload Excel File */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Bước 2: Tải lên file Excel đã điền
              </span>
              <p className="text-xs text-slate-300">
                Chọn file Excel (.xlsx, .xls) hoặc file CSV để hệ thống tự động cập nhật toàn bộ danh sách đại biểu.
              </p>
              <label className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-xl text-xs shadow-lg cursor-pointer transition-transform active:scale-95">
                <Upload className="w-4 h-4" />
                <span>Chọn File Excel Từ Máy Tính</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Lữ đoàn 162 - Vùng 4 Hải quân © 2026
      </footer>
    </div>
  );
}
