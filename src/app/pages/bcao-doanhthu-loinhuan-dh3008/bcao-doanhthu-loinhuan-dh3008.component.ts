import { Component, OnInit } from '@angular/core';
import highcharts3D from 'highcharts/highcharts-3d';
import * as Highcharts from 'highcharts/highcharts'
highcharts3D(Highcharts);
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-bcao-doanhthu-loinhuan-dh3008',
  templateUrl: './bcao-doanhthu-loinhuan-dh3008.component.html',
  styleUrls: ['./bcao-doanhthu-loinhuan-dh3008.component.css']
})
export class BcaoDThuLoinhuanDh3008Component implements OnInit {
  abc = 2
  isLoading: boolean = false;
  dTrongNgay: Date = new Date();
  dTrongThang: Date = new Date();
  today: Date = new Date();

  lstYear: any = [];
  lstQuy: any = [];
  selectedQuy: any;
  selectedYear: any;
  nguonTheoLoaiHinh: any;
  optionLoaiHinh: any;
  highcharts = Highcharts;
  highchartKBD = Highcharts;
  chartOptions: any;
  highchartTTS = Highcharts;

  chartOptionKBD: any;
  chartOptionTTS: any;

  isShowTable: boolean = false;
  cols: any;
  lstLoaiHinh: any;
  dataNguonLH: any = [];
  year_has_value: any;
  summary: string;
  tyLeTangGiam: string;
  chenhLech: number = 0;
  legend: any = [];
  lableKBD: any = [];
  charColor: any = [];
  lstDataYearSelect: any = [];
  lstDataNamTrc: any = [];
  dmucKhoi: any[] = []
  dataChart_BD: any[] = [];
  dataChart_TTS: any[] = [];
  dataAllNamHT: any[] = []
  dataAllNamTrc: any[] = []

  constructor(private router: Router, public service: CommonService,
    private utility: Utility, private messageService: MessageService) {
    this.dmucKhoi = [
      {
        KHOI: 'Hợp nhất EVN',
        KEY: 'HOP_NHAT'
      },
      {
        KHOI: 'Công ty mẹ',
        KEY: 'CTY_ME'
      },
      {
        KHOI: 'Khối phát điện',
        KEY: 'KPD'
      },
      {
        KHOI: 'Khối truyền tải điện',
        KEY: 'KTT'
      },
      {
        KHOI: 'Khối phân phối điện',
        KEY: 'KPP'
      }
    ]
  }

  ngOnInit() {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.today = new Date();
    for (let i = 2000; i <= this.today.getFullYear(); i++) {
      this.lstYear.push({ label: i, value: i });
    }
    this.lstQuy = [
      { value: 'Q1', label: 'Qúy 1' },
      { value: 'Q2', label: 'Qúy 2' },
      { value: 'Q3', label: 'Qúy 3' },
      { value: 'Q4', label: 'Qúy 4' },
    ]
    this.selectedYear = 2020;
    this.selectedQuy = 'Q1';
    this.year_has_value = this.selectedYear;
    this.getDataDThuLoiNhuan();
  }

  onYearChange(event) {
    this.getDataDThuLoiNhuan();
  }

  onQuyChange(event) {
    this.getDataDThuLoiNhuan();
  }



  async getDataDThuLoiNhuan() {
    this.isLoading = true;
    const response = await this.service.getDataAsync(this.utility.Get_Erp_DoanhThu_Ln(this.selectedQuy, this.selectedYear));
    const resLastYear = await this.service.getDataAsync(this.utility.Get_Erp_DoanhThu_Ln(this.selectedQuy, this.selectedYear - 1));
    if (response && response.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Báo cáo doanh thu lợi nhuận ${this.selectedQuy} ${this.selectedYear}!`
      });
      this.selectedYear = this.year_has_value;
      this.isLoading = false;
      return;
    }
    this.year_has_value = this.selectedYear;
    this.setData(response, resLastYear);
    this.dataAllNamHT = response.map((_arrayElement) => Object.assign({}, _arrayElement));
    this.dataAllNamTrc = resLastYear.map((_arrayElement) => Object.assign({}, _arrayElement));

    this.updateChartKBD();
    this.updateChartTTS();
    this.creatBieuSoSanh();
    this.isLoading = false;

  }

  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  getNumber(value : any){
    return Math.round(value);
  }

  stringFormat_pt(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.').concat('%');
  }

  sumField(data: any[], field) {
    let sum = 0;
    data.forEach(element => {
      sum += element[field];
    })
    return sum;
  }
  creatBieuSoSanh() {
    let dataAllNamHTSub = this.dataAllNamHT.filter(p => p.orgCode !== 'TH0002');
    let dataAllNamTrcSub = this.dataAllNamTrc.filter(p => p.orgCode !== 'TH0002')

    let DT_TNK_NamHT = dataAllNamHTSub.map(x => x.doanhThu_thunhapkhac).length > 0 ? dataAllNamHTSub.map(x => x.doanhThu_thunhapkhac).reduce((a, b) => a + b) : 0;
    let DT_TNK_NamTrc = dataAllNamTrcSub.map(x => x.doanhThu_thunhapkhac).length > 0 ? dataAllNamTrcSub.map(x => x.doanhThu_thunhapkhac).reduce((a, b) => a + b) : 0;

    let DT_BD_NamHT = dataAllNamHTSub.map(x => x.doanhThu_bandien).length > 0 ? dataAllNamHTSub.map(x => x.doanhThu_bandien).reduce((a, b) => a + b) : 0;
    let DT_BD_NamTrc = dataAllNamTrcSub.map(x => x.doanhThu_bandien).length > 0 ? dataAllNamTrcSub.map(x => x.doanhThu_bandien).reduce((a, b) => a + b) : 0;

    let DT_TTS_NamHT = dataAllNamHTSub.map(x => x.tongTaiSan).length > 0 ? dataAllNamHTSub.map(x => x.tongTaiSan).reduce((a, b) => a + b) : 0;
    let DT_TTS_NamTrc = dataAllNamTrcSub.map(x => x.tongTaiSan).length > 0 ? dataAllNamTrcSub.map(x => x.tongTaiSan).reduce((a, b) => a + b) : 0;

    let DT_VCSH_NamHT = dataAllNamHTSub.map(x => x.vonChuSoHuu).length > 0 ? dataAllNamHTSub.map(x => x.vonChuSoHuu).reduce((a, b) => a + b) : 0;
    let DT_VCSH_NamTrc = dataAllNamTrcSub.map(x => x.vonChuSoHuu).length > 0 ? dataAllNamTrcSub.map(x => x.vonChuSoHuu).reduce((a, b) => a + b) : 0;

    let DT_NSNN_NamHT = dataAllNamHTSub.map(x => x.nopNganSach).length > 0 ? dataAllNamHTSub.map(x => x.nopNganSach).reduce((a, b) => a + b) : 0;
    let DT_NSNN_NamTrc = dataAllNamTrcSub.map(x => x.nopNganSach).length > 0 ? dataAllNamTrcSub.map(x => x.nopNganSach).reduce((a, b) => a + b) : 0;
    this.legend = [
      {
        loai: 'Doanh thu và thu nhập khác',
        color: this.charColor[0],
        giatri: Math.round((DT_TNK_NamHT / 1000000000)),// Đơn vị  tỷ đồng
        tyLeSoSanh: DT_TNK_NamTrc > 0 ? Number((DT_TNK_NamHT - DT_TNK_NamTrc) / DT_TNK_NamTrc * 100) : 0
      },
      {
        loai: 'Doanh thu bán điện',
        color: this.charColor[1],
        giatri: Math.round((DT_BD_NamHT / 1000000000)), // Đơn vị  tỷ đồng
        tyLeSoSanh: DT_BD_NamTrc > 0 ? Number((DT_BD_NamHT - DT_BD_NamTrc) / DT_BD_NamTrc * 100) : 0
      },
      {
        loai: 'Tổng tài sản',
        color: this.charColor[2],
        giatri: Math.round(DT_TTS_NamHT / 1000000000),// Đơn vị  tỷ đồng
        tyLeSoSanh: DT_TTS_NamTrc > 0 ? Number((DT_TTS_NamHT - DT_TTS_NamTrc) / DT_TTS_NamTrc * 100) : 0
      },
      {
        loai: 'Vốn chủ sỡ hữu',
        color: this.charColor[3],
        giatri: Math.round(DT_VCSH_NamHT / 1000000000),// Đơn vị  tỷ đồng
        tyLeSoSanh: DT_VCSH_NamTrc > 0 ? Number((DT_VCSH_NamHT - DT_VCSH_NamTrc) / DT_VCSH_NamTrc * 100) : 0
      },
      {
        loai: 'Nộp ngân sách',
        color: this.charColor[4],
        giatri: Math.round(DT_NSNN_NamHT / 1000000000),// Đơn vị  tỷ đồng
        tyLeSoSanh: DT_NSNN_NamTrc > 0 ? Number((DT_NSNN_NamHT - DT_NSNN_NamTrc) / DT_NSNN_NamTrc * 100) : 0
      }

    ]
  }

  setData(data, dataLaYear) {

    let dmucChart = [
      {
        id: 0,
        name: this.selectedQuy.concat('/').concat(this.selectedYear),
        color: this.charColor[0]
      }, {
        id: 1,
        name: this.selectedQuy.concat('/').concat(Number(this.selectedYear - 1)),
        color: this.charColor[1]
      }
    ]
    this.lableKBD = ['Công ty mẹ', 'Khối phát điện', 'Khối truyền tải điện', 'Khối phân phối điện']

    this.lstDataYearSelect = [];
    this.lstDataNamTrc = [];

    this.creatDataTable(data, true);
    this.creatDataTable(dataLaYear, false);

    let dataBD_NamHt = [];
    let dataBD_NamTrc = [];
    let dataTTS_NamHt = [];
    let dataTTS_NamTrc = [];
    this.dataChart_TTS = [];
    this.dataChart_BD = [];
    for (let index = 0; index < this.dmucKhoi.length; index++) {
      if (index !== 0) {
        let lstDataByKhoi = this.lstDataYearSelect.filter(x => x.KEY == this.dmucKhoi[index].KEY);
        let lstDataCTiet = lstDataByKhoi.length > 0 ? lstDataByKhoi[0].DATA_CTIET : [];
        let dThuBD = lstDataCTiet.length > 0 ? lstDataCTiet.map(x => x.DTHU_BDIEN).reduce((a, b) => a + b) : 0;
        if (dThuBD != 0) {
          dataBD_NamHt.push(Math.round(Number(dThuBD / 1000000000)));
        }
        let tongTSan = lstDataCTiet.length > 0 ? lstDataCTiet.map(x => x.TONG_TSAN).reduce((a, b) => a + b) : 0;
        if (tongTSan != 0) {
          dataTTS_NamHt.push(Math.round(Number((tongTSan / 1000000000))));
        }
        let lstDataByKhoi_NamTrc = this.lstDataNamTrc.filter(x => x.KEY == this.dmucKhoi[index].KEY);
        let lstDataCTiet_NamTrc = lstDataByKhoi_NamTrc.length > 0 ? lstDataByKhoi_NamTrc[0].DATA_CTIET : [];
        let dThuBD_NamTrc = lstDataCTiet_NamTrc.length > 0 ? lstDataCTiet_NamTrc.map(x => x.DTHU_BDIEN).reduce((a, b) => a + b) : 0;

        if (dThuBD_NamTrc != 0) {
          dataBD_NamTrc.push(Math.round(Number(dThuBD_NamTrc / 1000000000)));
        }
        let tongTS_NamTrc = lstDataCTiet_NamTrc.length > 0 ? lstDataCTiet_NamTrc.map(x => x.TONG_TSAN).reduce((a, b) => a + b) : 0;

        if (tongTS_NamTrc != 0) {
          dataTTS_NamTrc.push(Math.round(Number((tongTS_NamTrc / 1000000000))));
        }

        /// Tổng tài sản

      }
    }
    this.dataChart_BD.push(
      {
        name: dmucChart[1].name,
        data: dataBD_NamTrc,
        color: dmucChart[1].color,
      }
    )
    this.dataChart_BD.push(
      {
        name: dmucChart[0].name,
        data: dataBD_NamHt,
        color: dmucChart[0].color,
      }
    )
    this.dataChart_TTS.push(
      {
        name: dmucChart[1].name,
        data: dataTTS_NamTrc,
        color: dmucChart[1].color,
      }
    )
    this.dataChart_TTS.push(
      {
        name: dmucChart[0].name,
        data: dataTTS_NamHt,
        color: dmucChart[0].color,
      }
    )



  }

  creatDataTable(data, isNamHTai) {
    if (data.length > 0) {
      let _hopNhatEVN = data.filter(p => p.orgCode == 'TH0002');
      let _ctyMeEVN = data.filter(p => p.orgCode == 'TH0001');
      let _genco1 = data.filter(p => p.orgCode == 'TH0102');
      let _genco2 = data.filter(p => p.orgCode == 'TH0202');
      let _genco3 = data.filter(p => p.orgCode == 'TH0302');
      let _npt = data.filter(p => p.orgCode == 'TH0902');
      let _cpc = data.filter(p => p.orgCode == 'TH0502');
      let _npc = data.filter(p => p.orgCode == 'TH0402');
      let _spc = data.filter(p => p.orgCode == 'TH0602');
      let _hanoi = data.filter(p => p.orgCode == 'TH0702');
      let _hcm = data.filter(p => p.orgCode == 'TH0802');

      /// Creatdata table theo mẫu sau để dễ group trên lưới
      let dataTable = [
        {
          KHOI: this.dmucKhoi[0].KHOI,
          KEY: this.dmucKhoi[0].KEY,
          DATA_CTIET: [
            {
              DON_VI: 'Hợp nhất EVN',
              DTHU_KHAC: this.sumField(_hopNhatEVN, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_hopNhatEVN, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_hopNhatEVN, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_hopNhatEVN, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_hopNhatEVN, 'nopNganSach')
            }
          ]
        },
        {
          KHOI: this.dmucKhoi[1].KHOI,
          KEY: this.dmucKhoi[1].KEY,
          DATA_CTIET: [
            {
              DON_VI: 'Công ty mẹ',
              DTHU_KHAC: this.sumField(_ctyMeEVN, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_ctyMeEVN, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_ctyMeEVN, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_ctyMeEVN, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_ctyMeEVN, 'nopNganSach')
            }
          ]
        },
        {
          KHOI: this.dmucKhoi[2].KHOI,
          KEY: this.dmucKhoi[2].KEY,
          DATA_CTIET: [
            {
              DON_VI: 'GENCO1',
              DTHU_KHAC: this.sumField(_genco1, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_genco1, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_genco1, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_genco1, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_genco1, 'nopNganSach')
            },
            {
              DON_VI: 'GENCO2',
              DTHU_KHAC: this.sumField(_genco2, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_genco2, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_genco2, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_genco2, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_genco2, 'nopNganSach')
            },
            {
              DON_VI: 'GENCO3',
              DTHU_KHAC: this.sumField(_genco3, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_genco3, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_genco3, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_genco3, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_genco3, 'nopNganSach')

            }
          ]
        },
        {
          KHOI: this.dmucKhoi[3].KHOI,
          KEY: this.dmucKhoi[3].KEY,

          DATA_CTIET: [
            {
              DON_VI: 'NPT',
              DTHU_KHAC: this.sumField(_npt, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_npt, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_npt, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_npt, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_npt, 'nopNganSach')
            },

          ]
        },
        {
          KHOI: this.dmucKhoi[4].KHOI,
          KEY: this.dmucKhoi[4].KEY,
          DATA_CTIET: [
            {
              DON_VI: 'CPC',
              DTHU_KHAC: this.sumField(_cpc, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_cpc, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_cpc, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_cpc, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_cpc, 'nopNganSach')

            },
            {
              DON_VI: 'HANOI',
              DTHU_KHAC: this.sumField(_hanoi, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_hanoi, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_hanoi, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_hanoi, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_hanoi, 'nopNganSach')

            },
            {
              DON_VI: 'HCMC',
              DTHU_KHAC: this.sumField(_hcm, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_hcm, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_hcm, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_hcm, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_hcm, 'nopNganSach')
            },

            {
              DON_VI: 'NPC',
              DTHU_KHAC: this.sumField(_npc, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_npc, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_npc, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_npc, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_npc, 'nopNganSach')

            },
            {
              DON_VI: 'SPC',
              DTHU_KHAC: this.sumField(_spc, 'doanhThu_thunhapkhac'),
              DTHU_BDIEN: this.sumField(_spc, 'doanhThu_bandien'),
              TONG_TSAN: this.sumField(_spc, 'tongTaiSan'),
              VON_CHUSH: this.sumField(_spc, 'vonChuSoHuu'),
              NOP_NSNN: this.sumField(_spc, 'nopNganSach')


            }
          ]
        }
      ]
      if (isNamHTai) {
        this.lstDataYearSelect = dataTable
      } else this.lstDataNamTrc = dataTable;
    }

  }
  updateChartTTS() {
    this.highchartTTS.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTTS = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableKBD,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold;font-size: 12px !important">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold">Doanh thu bán điện (tỷ đồng)</span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: this.dataChart_TTS
    }
  }
  updateChartKBD() {

    this.highchartKBD.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionKBD = {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 5,
          beta: 5,
          viewDistance: 35,
          depth: 40
        }
        // type: 'bar'
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableKBD,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold;font-size: 12px !important">${this.value}</span>`
          }
        },
      },
      yAxis: {
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold">Doanh thu bán điện (tỷ đồng)</span>`,
        },
        labels: {
          formatter: function () {
            let temp = this.value.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        },
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      tooltip: {
        // shared: true,
        // useHTML: true,
        // headerFormat: `<span style="font-size:10px">{point.key}</span><table>`,
        // pointFormat: `<tr>
        //                 <td style="color:{series.color};padding:0">{series.name}: </td>  
        //                 <td style="padding:0"><b>{point.y:.1f} %</b></td>
        //               </tr>`,
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: this.dataChart_BD
    }
  }

}