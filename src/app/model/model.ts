
export interface NguonLoaiHinh {
    LOAI_HINH: string;
    GIA_TRI: number;
}
export interface NguonChuSoHuu {
    LOAI_HINH: string;
    GIA_TRI: number;
}

export interface PhuTai {
    MIEN: string;
    NGAY: number;
    THOI_DIEM: string;
    GIA_TRI: number
}

export interface ThuongPham {
    MA_TPPT: string;
    TEN_TPTT: string;
    SAN_LUONG: number;
    THANG: number;
    NAM: number;
}

export interface TietKiemDien {
    MA_TINH: string;
    TEN_TINH: string;
    SLUONG_TKD: number;
    THANG: number;
    NAM: number;
}

export interface HoChua {
    MA_HOCHUA: string;
    TEN_HOCHUA: string;
    MUC_NUOC: number;
    LUU_LUONG: number;
    NGAY_TH: Date;
}