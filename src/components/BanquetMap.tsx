import React, { useState } from 'react';
import { Delegate } from '../types';
import { BANQUET_TABLES } from '../mockData';
import { Award, Users, MapPin, Sparkles, Utensils } from 'lucide-react';

interface BanquetMapProps {
  delegates: Delegate[];
  selectedDelegateId?: string;
  onSelectDelegate: (id: string) => void;
}

export function BanquetMap({ delegates, selectedDelegateId, onSelectDelegate }: BanquetMapProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>('all');

  const selectedDelegate = delegates.find(d => d.id === selectedDelegateId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" /> Tiệc mừng trọng thể
          </div>
          <h2 className="text-2xl font-black tracking-tight">SƠ ĐỒ BÀN TIỆC - LỄ ĐÓN NHẬN ANH HÙNG LLVTND</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Bố trí các bàn tiệc thân mật dành cho thủ trưởng Bộ Quốc phòng, Quân chủng, Vùng 4, đại biểu khách mời và cán bộ chiến sĩ Lữ đoàn 162 tại Nhà ăn Chỉ huy.
          </p>
        </div>

        {/* Table Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTableId('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTableId === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tất cả bàn tiệc
          </button>
          {BANQUET_TABLES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTableId(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedTableId === t.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Bàn {t.tableNumber} {t.vip ? '(VIP)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Banquet Tables Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tables Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {BANQUET_TABLES.map(table => {
            const tableDelegates = delegates.filter(
              d => d.banquetSeat.tableNumber === table.tableNumber
            );
            const isHighlighted = selectedTableId === 'all' || selectedTableId === table.id;

            return (
              <div
                key={table.id}
                className={`bg-slate-950 rounded-3xl border-2 p-6 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between ${
                  table.vip
                    ? 'border-amber-500/50 bg-gradient-to-b from-slate-950 via-slate-950 to-amber-950/20'
                    : 'border-slate-800'
                } ${!isHighlighted ? 'opacity-40' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                      table.vip ? 'bg-amber-500 text-slate-950' : 'bg-blue-900 text-blue-200'
                    }`}>
                      {table.vip ? '⭐ Bàn VIP' : 'Bàn Tiêu Chuẩn'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Sức chứa: {table.capacity} khách
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-white mb-1 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    {table.tableName}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Khu vực tiệc mừng trung tâm Lữ đoàn 162
                  </p>
                </div>

                {/* Delegates Seated at this Table */}
                <div className="space-y-2 mt-2 pt-4 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-amber-400/80 uppercase tracking-wider mb-2">
                    Đại biểu ngồi bàn này ({tableDelegates.length}):
                  </div>

                  {tableDelegates.length > 0 ? (
                    <div className="space-y-1.5">
                      {tableDelegates.map(d => {
                        const isSelected = d.id === selectedDelegateId;
                        return (
                          <div
                            key={d.id}
                            onClick={() => onSelectDelegate(d.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-white shadow-lg font-bold scale-[1.02]'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                            }`}
                          >
                            <div className="truncate">
                              <div className="text-xs font-bold truncate">{d.name}</div>
                              <div className="text-[10px] opacity-80 truncate">{d.title}</div>
                            </div>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                              isSelected ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {d.banquetSeat.seatNumber}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2 text-center bg-slate-900/50 rounded-xl">
                      Chưa có đại biểu được gán ghế bàn này
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Delegate Banquet Seat Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-amber-500/30 p-6 text-white shadow-xl sticky top-24">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                🥂
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Thông Tin Ghế Tiệc Mừng
                </h3>
                <p className="text-xs text-slate-400">Chọn đại biểu để xem vị trí tiệc</p>
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
                    <span className="text-xs text-slate-400">Bàn tiệc:</span>
                    <span className="text-xs font-bold text-amber-400 text-right">{selectedDelegate.banquetSeat.table}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Số bàn:</span>
                    <span className="text-sm font-mono font-extrabold text-amber-400">Bàn {selectedDelegate.banquetSeat.tableNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Số ghế:</span>
                    <span className="text-sm font-mono font-extrabold text-emerald-400">{selectedDelegate.banquetSeat.seatNumber}</span>
                  </div>
                </div>

                <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-900/50 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Thực đơn tiệc mừng:</span>
                  </div>
                  <p>Ẩm thực hải quân đặc sắc, chào mừng Lữ đoàn 162 đón nhận danh hiệu Anh hùng LLVTND.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
                <p className="text-sm">Chưa chọn đại biểu nào.<br />Vui lòng chọn đại biểu từ danh sách bàn.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
