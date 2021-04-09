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
  selector: 'app-dh3008-chi-tieu-hieu-qua-tai-chinh0702',
  templateUrl: './dh3008-chi-tieu-hieu-qua-tai-chinh0702.component.html',
  styleUrls: ['./dh3008-chi-tieu-hieu-qua-tai-chinh0702.component.css']
})
export class Dh3008ChiTieuHieuQuaTaiChinh0702Component implements OnInit {

  isLoading: boolean = false;
  today: Date;
  dThangSelected: Date;

  nguonTheoLoaiHinh: any;
  optionLoaiHinh: any;
  highchartTHKH = Highcharts;
  chartOptionTHKH: any;

  isShowTable: boolean = false;
  cols: any;
  lstLoaiHinh: any;
  dataNguonLH: any = [];
  dataKeHoach: any = [];
  dataThucHien: any = [];
  dateHasValue: any;
  summary: string;
  lableKHTH: any = [];
  charColor: any = [];
  lstData: any = [];
  lstQuy: any = [];
  lstYear: any = [];
  selectedYear: any;
  selectedQuy: any;

  constructor(private router: Router, public service: CommonService,
    private utility: Utility, private messageService: MessageService, private datePipe: DatePipe) { }

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
    this.dThangSelected = new Date();
    this.dThangSelected.setMonth(this.today.getMonth() - 2);
    this.getDataNguonLH();
  }
  onQuyChange(event) {
    this.getDataNguonLH();
  }
  onYearChange(event) {
    this.getDataNguonLH();
  }

  async getDataNguonLH() {
    this.isLoading = true;
    const res = await this.service.getDataAsync(this.utility.Get_A0_DienSanXuatHeThong(this.dThangSelected.getMonth() + 1, this.dThangSelected.getFullYear()));
    if ((res && res.length == 0) || !res[0].thucHienNThang || res[0].thucHienNThang == "") {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Cơ cấu nguồn điện theo loại hình ${this.datePipe.transform(this.dThangSelected, "MM/yyyy")}!`
      });
      this.dThangSelected = this.dateHasValue;
      this.isLoading = false;
      return;
    }

    this.dateHasValue = this.dThangSelected;
    // console.log("nguon loai hinh", res)
    this.xulyData(res);
    this.updateChartKHTH();
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

  xulyData(data) {
    this.dataNguonLH = [];
    this.lstData = [];
    this.lableKHTH = [];
    this.dataKeHoach = [];
    this.dataThucHien = [];

    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].thucHienNThang;
    }
    if (sum.toString().includes('.')) {
      this.summary = this.stringFormat(sum.toFixed(3));
    } else {
      this.summary = this.stringFormat(sum);
    }
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let _typleLH = [];
      let _kh = [];
      let _th = [];
      let _phanTram = (element.thucHienNThang / sum) * 100;
      _typleLH[0] = `${element.loai_nguon}`;
      _typleLH[1] = parseFloat(_phanTram.toFixed(2));
      _kh[0] = `${element.loai_nguon}`;
      _kh[1] = parseFloat(element.keHoachNThang);
      _th[0] = `${element.loai_nguon}`;
      _th[1] = Math.round(element.thucHienNThang);
      this.lableKHTH.push(element.loai_nguon);
      this.dataNguonLH.push(_typleLH);
      this.dataKeHoach.push(_kh);
      this.dataThucHien.push(_th);
    }

    this.lstData = data;
    for (let i = 0; i < this.lstData.length; i++) {
      const element = this.lstData[i];
      element.soSanhKhThangNamTruoc = this.stringFormat(((element.thucHienNThang || 0) * 100 / (element.keHoachNThang || 1)).toFixed(2));
      element.soSanhKhNamNamTruoc = this.stringFormat(((element.thucHienNThang || 0) * 100 / (element.keHoachCaNam || 1)).toFixed(2));
      element.keHoachNThang = this.stringFormat((element.keHoachNThang || 0).toFixed(2));
      element.keHoachCaNam = this.stringFormat((element.keHoachCaNam || 0).toFixed(2));
      element.thucHienNThang = this.stringFormat((element.thucHienNThang || 0).toFixed(0));
      element.soSanhThucHienCungKyNamTruoc = this.stringFormat((element.soSanhThucHienCungKyNamTruoc || 0).toFixed(2));
      // if (element.soSanhKhThangNamTruoc == "NaN") { element.soSanhKhThangNamTruoc = "0" }
      // if (element.soSanhKhNamNamTruoc == "NaN") { element.soSanhKhNamNamTruoc = "0" }
      // if (element.soSanhThucHienCungKyNamTruoc == "NaN") { element.soSanhThucHienCungKyNamTruoc = "0" }
    }
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
      },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tỷ lệ giải phóng mặt bằng/ tổng diện tích cần GPMB theo dự án tuần ${this.datePipe.transform(this.dGPMB, "w")} ngày ${this.datePipe.transform(this.dGPMB, "dd/MM/yyyy")} 
        // so sánh với tuần ${this.datePipe.transform(this.dGPMB_befor, "w")} (N-1) </span>`,
      },
      xAxis: {
        categories: this.lableKHTH,
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
            return `<span style="font-weight:bold">${temp}%</span>`
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
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
            }

          }
        }
      },
      series: [
        {
          name: 'Q3/2019',
          data: this.dataThucHien,
          color: '#5899DA'
        },
        {
          name: 'Q3/2020',
          data: this.dataKeHoach,
          color: '#F39738'
        }]
    };
  }
}
