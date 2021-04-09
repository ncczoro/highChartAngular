export class Utility {

    GetTyLeNguonLoaiHinh(nam: number) {
        return `qlkt_ws_vpcp/ws/bccp/GetTyLeNguonLoaiHinh?nam=${nam}`
    }
    GetTyLeNguonChuSoHuu(nam: number) {
        return `qlkt_ws_vpcp/ws/bccp/GetTyLeNguonChuSoHuu?nam=${nam}`
    }
    GetPhuTai(ngay) {
        return `qlkt_ws_vpcp/ws/bccp/GetPhuTai?ngay=${ngay}`
    }
    GetTyTrong5Tp(nam: number, thang: number) {
        return `qlkt_ws_vpcp/ws/bccp/GetTyTrong5Tp?nam=${nam}&thang=${thang}`
    }
    GetTop10TinhThanh(nam: number, thang: number) {
        return `qlkt_ws_vpcp/ws/bccp/GetTop10TinhThanh?nam=${nam}&thang=${thang}`
    }
    getHoChua() {
        return `qlkt_ws_vpcp/ws/bccp/getHoChua`;
    }
    getThuyVanHoChua(ngay, maHoChua, soNgay) {
        return `qlkt_ws_vpcp/ws/bccp/getThuyVanHoChua?ngay=${ngay}&ma_hochua=${maHoChua}&so_ngay=${soNgay}`
    }
    getGPMB_TheoDienTich(ngay) {
        return `qlkt_ws_vpcp/ws/bccp/getGPMB_TheoDienTich?ngay=${ngay}`
    }
    getGPMB_TheoHo(ngay) {
        return `qlkt_ws_vpcp/ws/bccp/getGPMB_TheoHo?ngay=${ngay}`
    }
    Get_CQHC(nam: number, thang: number) {
        return `qlkt_ws_vpcp/ws/bccp/Get_KHTD_CQHC?nam=${nam}&thang=${thang}&nhom=CQHC`
    }
    Get_KHTD(nam: number, thang: number) {
        return `qlkt_ws_vpcp/ws/bccp/Get_KHTD_CQHC?nam=${nam}&thang=${thang}&nhom=KHTD`
    }

    Get_A0_Cc_HuyDongNguon_Lh_MonthYear(thang: number, nam: number) {
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_A0_Cc_HuyDongNguon_Lh_MonthYear?nam=${nam}&thang=${thang}`
    }
    Get_A0_Cc_HuyDongNguon_Lh_Day(ngay: string) { // 31-03-2021
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_A0_Cc_HuyDongNguon_Lh_Day?ngaydlieu=${ngay}`
    }
    Get_A0_DienSanXuatHeThong(thang: number, nam: number) {
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_A0_DienSanXuatHeThong?nam=${nam}&thang=${thang}`
    }

    Get_Pmis_B3_TongHopSuCo(loaihinh: string, ngay_dlieu: string) { // 31-03-2021
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_Pmis_B3_TongHopSuCo?loaihinh=${loaihinh}&ngay_dlieu=${ngay_dlieu}`
    }

    Get_A0_TruyenTai3Mien(ngay: string) { //31-03-2021
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_A0_TruyenTai3Mien?ngay_dlieu=${ngay}`
    }
    Get_Dtxd_Ke_Hoach_Dau_Tu(param) {
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_Dtxd_Ke_Hoach_Dau_Tu?nam=${param.NAM}&thang=${param.THANG}&iddonvi=${param.DONVI}`;
    }
    Get_Erp_DoanhThu_Ln(quy, nam) {
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_Erp_DoanhThu_Ln?nam=${nam}&quy=${quy}`;
    }
    Get_Cmis_Ctieu_Kdoanh(nam, thang, loaibcao) {
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_Cmis_Ctieu_Kdoanh?nam=${nam}&thang=${thang}&loaibaocao=${loaibcao}`;
    }
    Get_Cmis_Kehoach_Kdoanh(nam) {
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_Cmis_Kehoach_Kdoanh?nam=${nam}`;
    }
    Get_Hrms_NangSuatLaoDong(nam) {
        return `qlkt_ws_vpcp/ws/evn_hotro_dieuhanh/Get_Hrms_NangSuatLaoDong?nam=${nam}`;
    }

}