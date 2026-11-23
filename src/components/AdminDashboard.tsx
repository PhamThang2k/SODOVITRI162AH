import React, { useState } from 'react';
import { Delegate } from '../types';
import { Users, Search, Plus, QrCode, CheckCircle2, XCircle, MapPin, Award, Edit3, Trash2, Shield, Printer } from 'lucide-react';

interface AdminDashboardProps {
  delegates: Delegate[];
  onAddDelegate: (delegate: Delegate) => void;
  onUpdateDelegate: (delegate: Delegate) => void;
  onDeleteDelegate: (id: string) => void;
  onSelectDelegateForScan: (id: string) => void;
  onOpenInvitationModal: (delegate: Delegate) => void;
  setActiveTab: (tab: 'admin' | 'hall' | 'banquet' | 'scan' | 'cards') => void;
}

export function AdminDashboard({
  delegates,
  onAddDelegate,
  onUpdateDelegate,
  onDeleteDelegate,
  onSelectDelegateForScan,
  onOpenInvitationModal,
  setActiveTab,
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDelegate, setEditingDelegate] = useState<Delegate | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Delegate>>({
    name: '',
    title: '',
    unit: '',
    category: 'ĐẠI BIỂU QUÂN CHỦNG',
    hallSeat: { zone: 'Khu vực B - Khối Quân chủng & Vùng 4', row: 'Hàng 2', seatNumber: 'B-04' },
    banquetSeat: { table: 'Bàn VIP 02', tableNumber: 2, seatNumber: 'Ghế số 04' },
    phone: '',
    notes: '',
  });

  const filteredDelegates = delegates.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.unit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingDelegate(null);
    setFormData({
      name: '',
      title: '',
      unit: '',
      category: 'ĐẠI BIỂU QUÂN CHỦNG',
      hallSeat: { zone: 'Khu vực B - Khối Quân chủng & Vùng 4', row: 'Hàng 2', seatNumber: 'B-04' },
      banquetSeat: { table: 'Bàn VIP 02', tableNumber: 2, seatNumber: 'Ghế số 04' },
      phone: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (delegate: Delegate) => {
    setEditingDelegate(delegate);
    setFormData(delegate);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.title) return;

    if (editingDelegate) {
      onUpdateDelegate({
        ...(editingDelegate),
        ...(formData as Delegate),
      });
    } else {
      const newDel: Delegate = {
        id: `del-${Date.now()}`,
        name: formData.name || '',
        title: formData.title || '',
        unit: formData.unit || 'Lữ đoàn 162',
        category: formData.category || 'ĐẠI BIỂU QUÂN CHỦNG',
        hallSeat: formData.hallSeat || { zone: 'Khu vực C', row: 'Hàng 3', seatNumber: 'C-20' },
        banquetSeat: formData.banquetSeat || { table: 'Bàn 03', tableNumber: 3, seatNumber: 'Ghế số 05' },
        phone: formData.phone || '',
        checkedIn: false,
        notes: formData.notes || '',
      };
      onAddDelegate(newDel);
    }
    setIsModalOpen(false);
  };

  const checkedInCount = delegates.filter(d => d.checkedIn).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Tổng Đại Biểu</span>
            <div className="text-3xl font-black text-white">{delegates.length}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Đã Check-in</span>
            <div className="text-3xl font-black text-emerald-400">{checkedInCount}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Sơ Đồ Hội Trường</span>
            <div className="text-3xl font-black text-amber-400">4 Khu Vực</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Bàn Tiệc Mừng</span>
            <div className="text-3xl font-black text-indigo-400">6 Bàn Tiệc</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Action Bar & Search */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đại biểu, chức vụ, đơn vị..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white pl-11 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-amber-500 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Tất cả nhóm đại biểu</option>
            <option value="LÃNH ĐẠO CẤP CAO">Lãnh đạo cấp cao</option>
            <option value="ĐẠI BIỂU QUÂN CHỦNG">Đại biểu Quân chủng</option>
            <option value="ĐẠI BIỂU VÙNG 4">Đại biểu Vùng 4</option>
            <option value="KHÁCH MỜI TRUNG ƯƠNG/ĐỊA PHƯƠNG">Khách mời Trung ương/ĐP</option>
            <option value="CÁN BỘ, CHIẾN SĨ LỮ ĐOÀN 162">Cán bộ, CS Lữ đoàn 162</option>
          </select>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/20 text-sm transition-all transform active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm Đại Biểu</span>
          </button>
        </div>
      </div>

      {/* Delegates Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Đại Biểu & Đơn Vị</th>
                <th className="py-4 px-6 font-bold">Nhóm Đại Biểu</th>
                <th className="py-4 px-6 font-bold">Ghế Hội Trường</th>
                <th className="py-4 px-6 font-bold">Ghế Bàn Tiệc</th>
                <th className="py-4 px-6 font-bold text-center">Trạng Thái</th>
                <th className="py-4 px-6 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredDelegates.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-white text-base">{d.name}</div>
                    <div className="text-xs font-semibold text-amber-400">{d.title}</div>
                    <div className="text-xs text-slate-400">{d.unit}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {d.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-bold text-blue-300">{d.hallSeat.zone.split(' - ')[0]}</div>
                    <div className="text-xs font-mono font-extrabold text-amber-400">
                      {d.hallSeat.row} • Ghế {d.hallSeat.seatNumber}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs font-bold text-amber-300">{d.banquetSeat.table}</div>
                    <div className="text-xs font-mono font-extrabold text-emerald-400">
                      {d.banquetSeat.seatNumber}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onUpdateDelegate({ ...d, checkedIn: !d.checkedIn })}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                        d.checkedIn
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${d.checkedIn ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`}></span>
                      {d.checkedIn ? 'Đã Check-in' : 'Chưa đến'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          onSelectDelegateForScan(d.id);
                          setActiveTab('scan');
                        }}
                        title="Quét QR / Xem thẻ"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onOpenInvitationModal(d)}
                        title="In thiệp mời & QR"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-blue-500 hover:text-white text-blue-400 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(d)}
                        title="Chỉnh sửa"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-500 hover:text-white text-indigo-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDelegate(d.id)}
                        title="Xóa đại biểu"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Delegate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl text-white">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              {editingDelegate ? 'Chỉnh Sửa Thông Tin Đại Biểu' : 'Thêm Đại Biểu Mới'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Họ và tên đại biểu *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Đại tá Nguyễn Văn A"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Chức vụ *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Lữ đoàn trưởng Lữ đoàn 162"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Đơn vị công tác</label>
                  <input
                    type="text"
                    placeholder="VD: Lữ đoàn 162, Vùng 4"
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Nhóm đại biểu</label>
                  <select
                    value={formData.category || 'ĐẠI BIỂU QUÂN CHỦNG'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="LÃNH ĐẠO CẤP CAO">Lãnh đạo cấp cao</option>
                    <option value="ĐẠI BIỂU QUÂN CHỦNG">Đại biểu Quân chủng</option>
                    <option value="ĐẠI BIỂU VÙNG 4">Đại biểu Vùng 4</option>
                    <option value="KHÁCH MỜI TRUNG ƯƠNG/ĐỊA PHƯƠNG">Khách mời Trung ương/ĐP</option>
                    <option value="CÁN BỘ, CHIẾN SĨ LỮ ĐOÀN 162">Cán bộ, CS Lữ đoàn 162</option>
                  </select>
                </div>
              </div>

              {/* Hall Seat Settings */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Vị Trí Hội Trường</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Khu vực</label>
                    <input
                      type="text"
                      placeholder="Khu vực A / B / C / D"
                      value={formData.hallSeat?.zone || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hallSeat: { ...(formData.hallSeat || { zone: '', row: '', seatNumber: '' }), zone: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Hàng ghế</label>
                    <input
                      type="text"
                      placeholder="Hàng 1"
                      value={formData.hallSeat?.row || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hallSeat: { ...(formData.hallSeat || { zone: '', row: '', seatNumber: '' }), row: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Số ghế</label>
                    <input
                      type="text"
                      placeholder="A-01"
                      value={formData.hallSeat?.seatNumber || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hallSeat: { ...(formData.hallSeat || { zone: '', row: '', seatNumber: '' }), seatNumber: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Banquet Seat Settings */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Vị Trí Bàn Tiệc Mừng</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tên bàn</label>
                    <input
                      type="text"
                      placeholder="Bàn VIP 01"
                      value={formData.banquetSeat?.table || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          banquetSeat: { ...(formData.banquetSeat || { table: '', tableNumber: 1, seatNumber: '' }), table: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Số bàn (1-6)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.banquetSeat?.tableNumber || 1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          banquetSeat: { ...(formData.banquetSeat || { table: '', tableNumber: 1, seatNumber: '' }), tableNumber: parseInt(e.target.value) || 1 },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ghế ngồi</label>
                    <input
                      type="text"
                      placeholder="Ghế số 01"
                      value={formData.banquetSeat?.seatNumber || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          banquetSeat: { ...(formData.banquetSeat || { table: '', tableNumber: 1, seatNumber: '' }), seatNumber: e.target.value },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Ghi chú lưu ý</label>
                <input
                  type="text"
                  placeholder="VD: Đại biểu khách mời danh dự đặc biệt"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Lưu đại biểu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
