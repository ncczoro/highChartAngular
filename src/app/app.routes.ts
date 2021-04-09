import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { SampleDemoComponent } from './demo/view/sampledemo.component';
import { FormsDemoComponent } from './demo/view/formsdemo.component';
import { DataDemoComponent } from './demo/view/datademo.component';
import { PanelsDemoComponent } from './demo/view/panelsdemo.component';
import { OverlaysDemoComponent } from './demo/view/overlaysdemo.component';
import { MenusDemoComponent } from './demo/view/menusdemo.component';
import { MessagesDemoComponent } from './demo/view/messagesdemo.component';
import { MiscDemoComponent } from './demo/view/miscdemo.component';
import { EmptyDemoComponent } from './demo/view/emptydemo.component';
import { ChartsDemoComponent } from './demo/view/chartsdemo.component';
import { FileDemoComponent } from './demo/view/filedemo.component';
import { UtilsDemoComponent } from './demo/view/utilsdemo.component';
import { DocumentationComponent } from './demo/view/documentation.component';
import { AppMainComponent } from './app.main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { NguonLoaiHinhComponent } from './pages/nguon-loai-hinh/nguon-loai-hinh.component';
import { NguonChuSoHuuComponent } from './pages/nguon-chu-so-huu/nguon-chu-so-huu.component';
import { PhuTaiComponent } from './pages/phu-tai/phu-tai.component';
import { ThuongPhamComponent } from './pages/thuong-pham/thuong-pham.component';
import { THinhSDDienKhTDComponent } from './pages/tinh-hinh-sdung-dien-KHTD/tinh-hinh-sdung-dien-KHTD.component';
import { HoChuaComponent } from './pages/ho-chua/ho-chua.component';
import { GiaiPhongMbComponent } from './pages/giai-phong-mb/giai-phong-mb.component';
import { BanGiaoMbComponent } from './pages/ban-giao-mb/ban-giao-mb.component';
import { TinhHinhSdungDienCquanHchinhComponent } from './pages/tinh-hinh-sdung-dien-cquan-hchinh/tinh-hinh-sdung-dien-cquan-hchinh.component';
import { ChitieuKinhdoanhToanevnComponent } from './pages/chitieu-kinhdoanh-toanevn-dh3008/chitieu-kinhdoanh-toanevn.component';
import { DautuXaydungDh3008Component } from './pages/dautu-xaydung-dh3008/dautu-xaydung-dh3008.component';
import { Dh3008HdongNguonLoaiHinhComponent } from './pages/dh3008-hdong-nguon-loai-hinh/dh3008-hdong-nguon-loai-hinh.component';
import { Dh3008DienSxuatComponent } from './pages/dh3008-dien-sxuat/dh3008-dien-sxuat.component';
import { Dh3008ThopSuCoComponent } from './pages/dh3008-thop-su-co/dh3008-thop-su-co.component';
import { Dh3008TruyenTai3MienComponent } from './pages/dh3008-truyen-tai-3mien/dh3008-ttai-3mien.component';
import { BcaoDThuLoinhuanDh3008Component } from './pages/bcao-doanhthu-loinhuan-dh3008/bcao-doanhthu-loinhuan-dh3008.component';
import { NsuatLaodongDh3008Component } from './pages/nsuat-laodong-dh3008/nsuat-laodong-dh3008.component';
import { Dh3008HdongNguonSoHuuComponent } from './pages/dh3008-hdong-nguon-so-huu/dh3008-hdong-nguon-so-huu.component';
import { Dh3008DulieuPhuTai0226Component } from './pages/dh3008-dulieu-phu-tai0226/dh3008-dulieu-phu-tai0226.component';
import { Dh3008ThanTonKho0334Component } from './pages/dh3008-than-ton-kho0334/dh3008-than-ton-kho0334.component';
import { Dh3008KehoachGiaoMMTDTrucThuoc0306Component } from './pages/dh3008-kehoach-giao-mmtd-truc-thuoc0306/dh3008-kehoach-giao-mmtd-truc-thuoc0306.component';
import { Dh3008ChiTieuHieuQuaTaiChinh0702Component } from './pages/dh3008-chi-tieu-hieu-qua-tai-chinh0702/dh3008-chi-tieu-hieu-qua-tai-chinh0702.component';

export const routes: Routes = [
    { path: '', component: NguonLoaiHinhComponent },
    { path: 'co-cau-nguon', component: NguonLoaiHinhComponent },
    { path: 'phu-tai', component: PhuTaiComponent },
    { path: 'thuong-pham-and-ho-chua', component: ThuongPhamComponent },
    { path: 'giai-phong-mat-bang', component: GiaiPhongMbComponent },
    { path: 'ban-giao-mat-bang', component: BanGiaoMbComponent },
    { path: 'tinh-hinh-sdung-dien-cquan-hchinh', component: TinhHinhSdungDienCquanHchinhComponent },
    { path: 'tinh-hinh-sdung-dien-khang-tdiem', component: TinhHinhSdungDienCquanHchinhComponent },

    { path: 'hdn', component: Dh3008HdongNguonLoaiHinhComponent },
    { path: 'dsx', component: Dh3008DienSxuatComponent },
    { path: 'thsc', component: Dh3008ThopSuCoComponent },
    { path: 'tt3m', component: Dh3008TruyenTai3MienComponent },

    { path: 'ctkd', component: ChitieuKinhdoanhToanevnComponent },
    { path: 'dtxd', component: DautuXaydungDh3008Component },
    { path: 'dtln', component: BcaoDThuLoinhuanDh3008Component },
    { path: 'nsld', component: NsuatLaodongDh3008Component },

    { path: 'hdnsh0112', component: Dh3008HdongNguonSoHuuComponent },
    { path: 'ptai0226', component: Dh3008DulieuPhuTai0226Component },
    { path: 'ttk0334', component: Dh3008ThanTonKho0334Component },
    { path: 'khgnntd0306', component: Dh3008KehoachGiaoMMTDTrucThuoc0306Component },
    { path: 'cthqtk0702', component: Dh3008ChiTieuHieuQuaTaiChinh0702Component },

    { path: 'error', component: AppErrorComponent },
    { path: 'accessdenied', component: AppAccessdeniedComponent },
    { path: '404', component: AppNotfoundComponent },
];
/**
Địa chỉ máy em:
1. http://10.1.3.26:8084/co-cau-nguon
2. http://10.1.3.26:8084/phu-tai
3. http://10.1.3.26:8084/thuong-pham-and-ho-chua
4. http://10.1.3.26:8084/giai-phong-mat-bang
5. http://10.1.3.26:8084/ban-giao-mat-bang
6. http://10.1.3.26:8084/tinh-hinh-sdung-dien-cquan-hchinh
7. http://10.1.3.26:8084/tinh-hinh-sdung-dien-khang-tdiem
8. http://10.1.3.26:8084/hdn
9. http://10.1.3.26:8084/dsx
10. http://10.1.3.26:8084/thsc
11. http://10.1.3.26:8084/tt3m
12. http://10.1.3.26:8084/dtxd
13. http://10.1.3.26:8084/nsld

- ba Biểu đang hoàn thiện
14. http://10.1.3.26:8084/ctkd
15. http://10.1.3.26:8084/dtln

thay địa chỉ máy public 
http://10.0.64.51:8086
 */
export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: false, });