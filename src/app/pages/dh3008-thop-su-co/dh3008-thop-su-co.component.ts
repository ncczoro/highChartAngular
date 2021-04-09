import { Component, OnInit } from '@angular/core';
import highcharts3D from 'highcharts/highcharts-3d';
import * as Highcharts from 'highcharts/highcharts'
highcharts3D(Highcharts);
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dh3008-thop-su-co',
  templateUrl: './dh3008-thop-su-co.component.html',
  styleUrls: ['./dh3008-thop-su-co.component.css']
})
export class Dh3008ThopSuCoComponent implements OnInit {

  isLoading: boolean = false;
  today: Date;
  dDateSelected: Date;

  optionLoaiHinh: any;
  highchartTG = Highcharts;
  highchartSL = Highcharts;
  highchartTHKH = Highcharts;
  chartOptionSL: any;
  chartOptionTG: any;
  chartOptionTHKH: any;

  isShowTable: boolean = false;
  dataSL: any = [];
  dataTG: any = [];
  dataSuCoCungKy: any = [];
  dataSuCoLuyKe: any = [];
  dateHasValue: any;
  loaiHinhHasValue: any;
  summarySL: string;
  summaryTG: string;

  lableSSSC: any = [];
  charColor: any = [];

  lstData: any = [];
  lstEVN: any = [];
  lstThuocEVN: any = [];
  lstGENCO1: any = [];
  lstGENCO2: any = [];
  lstGENCO3: any = [];

  lstCNPD: any = [];
  selectedCNPD: any;
  math = Math;
  constructor(private router: Router, public service: CommonService,
    private utility: Utility, private messageService: MessageService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1'];
    this.lstCNPD = [
      { value: "", label: "Tất cả" },
      { value: "2801TD", label: "Thủy điện" },
      { value: "2802THAN", label: "Nhiệt điện than" },
      { value: "2803DAU", label: "Nhiệt điện dầu" },
      { value: "2804TBK", label: "Tuabin khí" },
    ]
    this.selectedCNPD = this.lstCNPD[1].value;
    this.today = new Date();
    this.dDateSelected = new Date();
    this.dDateSelected.setMonth(3);
    this.dDateSelected.setDate(0);
    this.getDataTHSC();
  }
  onSelectDate(event) {
    this.getDataTHSC();
  }
  onChageCNPD(event) {
    this.getDataTHSC();
  }

  async getDataTHSC() {
    this.isLoading = true;
    const res = await this.service.getDataAsync(this.utility.Get_Pmis_B3_TongHopSuCo(this.selectedCNPD, this.datePipe.transform(this.dDateSelected, "dd-MM-yyyy")));
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Tổng hợp sự cố ${this.selectedCNPD} ${this.datePipe.transform(this.dDateSelected, "dd/MM/yyyy")}!`
      });
      this.dDateSelected = this.dateHasValue;
      this.selectedCNPD = this.loaiHinhHasValue;
      this.isLoading = false;
      return;
    }
    let _sum = 0;
    res.forEach(element => {
      _sum += element.sanLuongThieuHut;
    });
    if (_sum == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Tổng hợp sự cố ${this.selectedCNPD} ${this.datePipe.transform(this.dDateSelected, "dd/MM/yyyy")}!`
      });
      this.dDateSelected = this.dateHasValue;
      this.selectedCNPD = this.loaiHinhHasValue;
      this.isLoading = false;
      return;
    }
    this.xulyData(res);
    this.updateChartSL();
    this.updateChartTG();
    this.updateChartKHTH();
    this.dateHasValue = this.dDateSelected;
    this.loaiHinhHasValue = this.selectedCNPD;
    this.isLoading = false;
  }

  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  stringFormat_pt(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.').concat('%');
  }

  xulyData(data: any[] = []) {
    try {

      this.lstData = data;
      this.dataSL = [];
      this.dataTG = [];
      this.lableSSSC = [];
      this.lstEVN = [];
      this.lstThuocEVN = [];
      this.lstGENCO1 = [];
      this.lstGENCO2 = [];
      this.lstGENCO3 = [];
      this.dataSuCoLuyKe = [];
      this.dataSuCoCungKy = [];

      this.lstEVN = data.filter(p => p.ma_donvi_cha === 'EVN' && p.ma_donvi);
      let _lstEVN_coTongCong = data.filter(p => p.ma_donvi_cha === 'EVN') || [];
      this.lstThuocEVN = data.filter(p => p.ma_donvi_cha === 'GE00');
      this.lstGENCO1 = data.filter(p => p.ma_donvi_cha === 'GCO1');
      this.lstGENCO2 = data.filter(p => p.ma_donvi_cha === 'GCO2');
      this.lstGENCO3 = data.filter(p => p.ma_donvi_cha === 'GCO3');
      let sumSL = 0;
      for (let i = 0; i < this.lstEVN.length; i++) {
        sumSL += parseFloat(this.lstEVN[i].sanLuongThieuHut);
      }
      this.summarySL = this.stringFormat((sumSL).toFixed(3));
      for (let i = 0; i < this.lstEVN.length; i++) {
        const element = this.lstEVN[i];
        let _typleLH = [];
        let _phanTram = ((element.sanLuongThieuHut) / sumSL) * 100;
        _typleLH[0] = `${element.ma_donvi == 'GE00' ? 'EVN' : element.ten_donvi}`;
        _typleLH[1] = parseFloat(_phanTram.toFixed(2));
        if (Number.isNaN(_typleLH[1])) { _typleLH[1] = 0 }
        this.dataSL.push(_typleLH);
      }
      let sumTG = 0;
      for (let i = 0; i < this.lstEVN.length; i++) {
        sumTG += parseFloat(this.lstEVN[i].thoiGianSuCo);
      }
      this.summaryTG = this.stringFormat((sumTG));
      for (let i = 0; i < this.lstEVN.length; i++) {
        const element = this.lstEVN[i];
        let _typleLH = [];
        let _phanTram = ((element.thoiGianSuCo) / sumTG) * 100;
        _typleLH[0] = `${element.ma_donvi == 'GE00' ? 'EVN' : element.ten_donvi}`;
        _typleLH[1] = parseFloat(_phanTram.toFixed(2));
        if (Number.isNaN(_typleLH[1])) { _typleLH[1] = 0 }
        this.dataTG.push(_typleLH);
      }

      for (let i = 0; i < _lstEVN_coTongCong.length; i++) {
        const element = _lstEVN_coTongCong[i];
        this.lableSSSC.push(element.ma_donvi == 'GE00' ? 'EVN' : element.ten_donvi);
        let _luyKe = [];
        _luyKe[0] = `${element.ma_donvi == 'GE00' ? 'EVN' : element.ten_donvi}`;
        _luyKe[1] = element.luyKeNam;
        let _cungKy = [];
        _cungKy[0] = `${element.ma_donvi == 'GE00' ? 'EVN' : element.ten_donvi}`;
        _cungKy[1] = element.luyKeNamCungKy;
        this.dataSuCoLuyKe.push(_luyKe);
        this.dataSuCoCungKy.push(_cungKy);
      }

    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  updateChartSL() {
    this.highchartSL.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionSL = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        // marginTop: 100
      },
      title: {
        useHTML: true,
        text:
          `
            <p style="font-family: 'Oswald';
            font-style: normal;
            font-weight: 600;
            font-size: 26px;
            line-height: 54px;
            color: #CE7A58;">${this.summarySL} (tr.kWh)</p>
            `
        ,
        align: 'center',
        verticalAlign: 'middle',
        y: 86
      },
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.key}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
        }
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            // format: '{point.name} ({point.percentage:.2f}%)',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return ` <span style="font-size:12px!important">${this.key}: ${temp}%</span><br/>`
            },
            style: {
              color: '#515151',
              fontsize: '12px',
              width: '100px'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '130%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Tỷ lệ',
        innerSize: '50%',
        data: this.dataSL,
      }]
    };
  }

  updateChartTG() {
    this.highchartTG.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionTG = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        // marginTop: 100
      },
      title: {
        useHTML: true,
        text:
          `
            <p style="font-family: 'Oswald';
            font-style: normal;
            font-weight: 600;
            font-size: 26px;
            line-height: 54px;
            color: #CE7A58;">${this.summaryTG} (phút)</p>
            `
        ,
        align: 'center',
        verticalAlign: 'middle',
        y: 86
      },
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.key}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
        }
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            // format: '{point.name} ({point.percentage:.2f}%)',
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return ` <span style="font-size:12px!important">${this.key}: ${temp}%</span><br/>`
            },
            style: {
              color: '#515151',
              fontsize: '12px',
              width: '100px'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '130%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Tỷ lệ',
        innerSize: '50%',
        data: this.dataTG,
      }]
    };
  }

  updateChartKHTH() {
    this.highchartTHKH.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionTHKH = {
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
        categories: this.lableSSSC,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold">${this.value}</span>`
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold"></span>`,
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
        // formatter: function () {
        //   let temp = this.y
        //   temp = temp.toString().replace('.', ',');
        //   return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
        // }
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
            // formatter: function () {
            //   let temp = this.y
            //   temp = temp.toString().replace('.', ',');
            //   return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            // }

          }
        }
      },
      series: [{
        name: 'Số vụ sự cố cùng kì',
        data: this.dataSuCoCungKy,
        color: '#F39738'
      }, {
        name: 'Số vụ sự cố lũy kế',
        data: this.dataSuCoLuyKe,
        color: '#5899DA'
      }]
    };
  }
}
