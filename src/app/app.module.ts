import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy, DatePipe } from '@angular/common';
import { AppRoutes } from './app.routes';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { GrowlModule } from 'primeng/growl';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { AppLoginComponent } from './pages/app.login.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import { AppTopbarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { AppRightpanelComponent } from './app.rightpanel.component';
import { AppInlineProfileComponent } from './app.profile.component';
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

import { CarService } from './demo/service/carservice';
import { CountryService } from './demo/service/countryservice';
import { EventService } from './demo/service/eventservice';
import { NodeService } from './demo/service/nodeservice';
import { BreadcrumbService } from './breadcrumb.service';
import { NguonLoaiHinhComponent } from './pages/nguon-loai-hinh/nguon-loai-hinh.component';
import { NguonChuSoHuuComponent } from './pages/nguon-chu-so-huu/nguon-chu-so-huu.component';
import { PhuTaiComponent } from './pages/phu-tai/phu-tai.component';
import { ThuongPhamComponent } from './pages/thuong-pham/thuong-pham.component';
import { THinhSDDienKhTDComponent } from './pages/tinh-hinh-sdung-dien-KHTD/tinh-hinh-sdung-dien-KHTD.component';
import { HoChuaComponent } from './pages/ho-chua/ho-chua.component';
import { GiaiPhongMbComponent } from './pages/giai-phong-mb/giai-phong-mb.component';
import { BanGiaoMbComponent } from './pages/ban-giao-mb/ban-giao-mb.component';
import { HighchartsChartModule } from 'highcharts-angular';
import highmaps from 'highcharts/modules/map.src';

import { TinhHinhSdungDienCquanHchinhComponent } from './pages/tinh-hinh-sdung-dien-cquan-hchinh/tinh-hinh-sdung-dien-cquan-hchinh.component';
import { Utility } from './pages/utility';
import { MessageService } from 'primeng/api';
import { LoadingComponent } from './pages/loading/loading.component';
import { HttpModule } from '@angular/http';
import { VietNamMap } from './pages/tinh-hinh-sdung-dien-cquan-hchinh/VietNamMap';
import { Dh3008HdongNguonLoaiHinhComponent } from './pages/dh3008-hdong-nguon-loai-hinh/dh3008-hdong-nguon-loai-hinh.component';
import { Dh3008DienSxuatComponent } from './pages/dh3008-dien-sxuat/dh3008-dien-sxuat.component';
import { Dh3008ThopSuCoComponent } from './pages/dh3008-thop-su-co/dh3008-thop-su-co.component';
import { Dh3008TruyenTai3MienComponent } from './pages/dh3008-truyen-tai-3mien/dh3008-ttai-3mien.component';
import { ChitieuKinhdoanhToanevnComponent } from './pages/chitieu-kinhdoanh-toanevn-dh3008/chitieu-kinhdoanh-toanevn.component';
import { DautuXaydungDh3008Component } from './pages/dautu-xaydung-dh3008/dautu-xaydung-dh3008.component';
import { CtietKehoachDautuComponent } from './pages/dautu-xaydung-dh3008/ctiet-kehoach-dautu/ctiet-kehoach-dautu.component';
import { BcaoDThuLoinhuanDh3008Component } from './pages/bcao-doanhthu-loinhuan-dh3008/bcao-doanhthu-loinhuan-dh3008.component';
import { NsuatLaodongDh3008Component } from './pages/nsuat-laodong-dh3008/nsuat-laodong-dh3008.component';
import { Dh3008HdongNguonSoHuuComponent } from './pages/dh3008-hdong-nguon-so-huu/dh3008-hdong-nguon-so-huu.component';
import { Dh3008DulieuPhuTai0226Component } from './pages/dh3008-dulieu-phu-tai0226/dh3008-dulieu-phu-tai0226.component';
import { Dh3008ThanTonKho0334Component } from './pages/dh3008-than-ton-kho0334/dh3008-than-ton-kho0334.component';
import { Dh3008KehoachGiaoMMTDTrucThuoc0306Component } from './pages/dh3008-kehoach-giao-mmtd-truc-thuoc0306/dh3008-kehoach-giao-mmtd-truc-thuoc0306.component';
import { Dh3008ChiTieuHieuQuaTaiChinh0702Component } from './pages/dh3008-chi-tieu-hieu-qua-tai-chinh0702/dh3008-chi-tieu-hieu-qua-tai-chinh0702.component';

// export function highChartModule() {
//     return [highmaps];
// }

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        HttpModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        GrowlModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        HighchartsChartModule
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppTopbarComponent,
        AppFooterComponent,
        AppBreadcrumbComponent,
        AppRightpanelComponent,
        AppInlineProfileComponent,
        DashboardDemoComponent,
        SampleDemoComponent,
        FormsDemoComponent,
        DataDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent, MenusDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        UtilsDemoComponent,
        DocumentationComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        AppLoginComponent,
        NguonLoaiHinhComponent,
        NguonChuSoHuuComponent,
        PhuTaiComponent,
        ThuongPhamComponent,
        THinhSDDienKhTDComponent,
        HoChuaComponent,
        GiaiPhongMbComponent,
        BanGiaoMbComponent,
        TinhHinhSdungDienCquanHchinhComponent,
        LoadingComponent,
        ChitieuKinhdoanhToanevnComponent,
        DautuXaydungDh3008Component,
        Dh3008HdongNguonLoaiHinhComponent,
        Dh3008DienSxuatComponent,
        Dh3008ThopSuCoComponent,
        Dh3008TruyenTai3MienComponent,
        Dh3008DienSxuatComponent,
        CtietKehoachDautuComponent,
        BcaoDThuLoinhuanDh3008Component,
        NsuatLaodongDh3008Component,
        Dh3008HdongNguonSoHuuComponent,
        Dh3008DulieuPhuTai0226Component,
        Dh3008ThanTonKho0334Component,
        Dh3008KehoachGiaoMMTDTrucThuoc0306Component,
        Dh3008ChiTieuHieuQuaTaiChinh0702Component
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // {provide: LocationStrategy, useClass: HashLocationStrategy},
        CarService, CountryService, EventService, NodeService, BreadcrumbService, Utility, MessageService, DatePipe, VietNamMap
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
