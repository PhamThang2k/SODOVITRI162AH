export interface SeatLocation {
  zone: string; // e.g., "Khu vực A - Bục danh dự" or "Khu vực B - Đại biểu Quân chủng"
  row: string;  // e.g., "Hàng 1"
  seatNumber: string; // e.g., "A-01"
  x?: number; // relative coordinate on map for pin (percentage)
  y?: number;
}

export interface BanquetSeatLocation {
  table: string; // e.g., "Bàn VIP 01"
  tableNumber: number;
  seatNumber: string; // e.g., "Ghế số 01"
  x?: number;
  y?: number;
}

export interface Delegate {
  id: string;
  name: string;
  title: string; // e.g. "Tư lệnh Quân chủng Hải quân"
  unit: string;  // e.g. "Bộ Tư lệnh Hải quân"
  category: 'LÃNH ĐẠO CẤP CAO' | 'ĐẠI BIỂU QUÂN CHỦNG' | 'ĐẠI BIỂU VÙNG 4' | 'KHÁCH MỜI TRUNG ƯƠNG/ĐỊA PHƯƠNG' | 'CÁN BỘ, CHIẾN SĨ LỮ ĐOÀN 162';
  hallSeat: SeatLocation;
  banquetSeat: BanquetSeatLocation;
  phone?: string;
  qrCodeUrl?: string;
  checkedIn?: boolean;
  notes?: string;
}

export interface HallZone {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  description: string;
}

export interface BanquetTable {
  id: string;
  tableName: string;
  tableNumber: number;
  capacity: number;
  vip: boolean;
}
