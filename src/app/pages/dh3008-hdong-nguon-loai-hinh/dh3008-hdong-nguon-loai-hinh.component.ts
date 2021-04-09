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
  selector: 'app-dh3008-hdong-nguon-loai-hinh',
  templateUrl: './dh3008-hdong-nguon-loai-hinh.component.html',
  styleUrls: ['./dh3008-hdong-nguon-loai-hinh.component.scss']
})
export class Dh3008HdongNguonLoaiHinhComponent implements OnInit {

  highchartNgay = Highcharts;
  chartOptionNgay: any;

  highchartThang = Highcharts;
  chartOptionThang: any;

  highchartNam = Highcharts;
  chartOptionNam: any;


  isLoading: boolean = false;
  dTrongNgay: Date;
  dTrongThang: Date;
  today: Date = new Date();

  lstYear: any = [];
  selectedYear: any;
  dataNguonLhNgay: any = [];
  dataNguonLhMonth: any = [];
  dataNguonLhYear: any = [];
  dayHasValue: any;
  monthYearHasValue: any;
  summary: string;
  summaryMonth: string;
  summaryYear: string;
  legendNgay: any = [];
  legendMonth: any = [];
  legendYear: any = [];
  charColor: any = [];

  constructor(private router: Router, public service: CommonService,
    private utility: Utility, private messageService: MessageService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.today = new Date();
    for (let i = 2000; i <= this.today.getFullYear(); i++) {
      this.lstYear.push({ label: i, value: i });
    }
    this.dTrongNgay = new Date();
    this.dTrongNgay.setDate(this.today.getDate() - 1);
    this.dayHasValue = this.dTrongNgay;
    this.dTrongThang = new Date();
    this.dTrongThang.setMonth(this.today.getMonth() - 1 );
    this.monthYearHasValue = this.dTrongNgay;
    this.getDataNguonLH_ngay(this.dTrongNgay);
    this.getDataNguonLH_thangNam(this.dTrongThang.getMonth() + 1, this.dTrongThang.getFullYear());
  }

  onSelectDate(event) {
    this.getDataNguonLH_ngay(this.dTrongNgay);
  }

  onYearChange(event) {

  }
  onSelectMonth(event) {
    this.getDataNguonLH_thangNam(this.dTrongThang.getMonth()+1, this.dTrongThang.getFullYear());
  }

  async getDataNguonLH_ngay(date: Date) {
    try {
      this.isLoading = true;
      let _day = this.datePipe.transform(date, 'dd-MM-yyyy');
      const res = await this.service.getDataAsync(this.utility.Get_A0_Cc_HuyDongNguon_Lh_Day(_day));
      if ((res && res.length == 0) || (res.lstDataDay && res.lstDataDay.length == 0)) {
        this.messageService.add({
          severity: "warn",
          summary: "Không có dữ liệu!",
          detail: `Cơ cấu nguồn điện theo loại hình ngày ${_day}!`
        });
        this.dTrongNgay = this.dayHasValue;
        this.isLoading = false;
        return;
      }
      if(!res.lstDataDay[0].sanLuong || res.lstDataDay[0].sanLuong == "") {
        this.messageService.add({
          severity: "warn",
          summary: "Không có dữ liệu!",
          detail: `Cơ cấu nguồn điện theo loại hình ngày ${_day}!`
        });
        this.dTrongNgay = this.dayHasValue;
        this.isLoading = false;
        return;
      }
      this.dayHasValue = this.dTrongNgay;
      this.xulyDataNgay(res.lstDataDay);
      this.updateChartNgay();
      this.isLoading = false;

    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  async getDataNguonLH_thangNam(thang: number, nam: number) {
    try {
      this.isLoading = true;
      const res = await this.service.getDataAsync(this.utility.Get_A0_Cc_HuyDongNguon_Lh_MonthYear(thang, nam));
      if ((res && res.length == 0) || (res.lstDataMonth && res.lstDataMonth.length == 0) || (res.lstDataYear && res.lstDataYear.length == 0)) {
        this.messageService.add({
          severity: "warn",
          summary: "Không có dữ liệu!",
          detail: `Lũy kế trong tháng ${this.datePipe.transform(this.dTrongThang, "MM/yyyy")}!`
        });
        this.dTrongThang = this.monthYearHasValue;
        this.isLoading = false;
        return;
      }
      if(!res.lstDataMonth[0].sanLuong || res.lstDataMonth[0].sanLuong == "" || !res.lstDataYear[0].sanLuong || res.lstDataYear[0].sanLuong == "") {
        this.messageService.add({
          severity: "warn",
          summary: "Không có dữ liệu!",
          detail: `Lũy kế trong tháng ${this.datePipe.transform(this.dTrongThang, "MM/yyyy")}!`
        });
        this.dTrongThang = this.monthYearHasValue;
        this.isLoading = false;
        return;
      }
      this.monthYearHasValue = this.dTrongThang;
      // console.log("nguon loai hinh", res)
      this.xulyDataMonth(res.lstDataMonth);
      this.updateChartMonth();
      this.xulyDataYear(res.lstDataYear);
      this.updateChartYear();
      this.isLoading = false;

    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  }

  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  stringFormat_pt(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.').concat('%');
  }

  xulyDataNgay(data) {
    try {
      this.dataNguonLhNgay = [];
      this.legendNgay = [];
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].sanLuong || 0;
      }
      this.summary = this.stringFormat(Math.round(sum));
      for (let i = 0; i < data.length; i++) {
        let element = data[i];
        if(!element.sanLuong || element.sanLuong == "") {element.sanLuong = 0};
        let _typleLH = []
        let _phanTram = (element.sanLuong / sum) * 100;
        _typleLH[0] = `${element.tenDonViCungCap}`;
        _typleLH[1] = parseFloat(_phanTram.toFixed(2));
        this.legendNgay.push({
          color: this.charColor[i],
          loai: element.tenDonViCungCap,
          code: element.orgCode,
          giatri: this.stringFormat(Math.round(element.sanLuong)),
          phantram: this.stringFormat_pt(_typleLH[1]),
          tyLeSoSanh: 0,
        })
        this.dataNguonLhNgay.push(_typleLH);
      }
    } catch (error) {
      console.log(error);
    }
  }
  xulyDataMonth(data) {
    try {


      this.dataNguonLhMonth = [];
      this.legendMonth = [];
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].sanLuong || 0;
      }
      this.summaryMonth = this.stringFormat(Math.round(sum));
      for (let i = 0; i < data.length; i++) {
        let element = data[i];
        if(!element.sanLuong || element.sanLuong == "") {element.sanLuong = 0};
        let _typleLH = []
        let _phanTram = ((element.sanLuong || 0) / sum) * 100;
        _typleLH[0] = `${element.tenDonViCungCap}`;
        _typleLH[1] = parseFloat(_phanTram.toFixed(2));
        this.legendMonth.push({
          color: this.charColor[i],
          loai: element.tenDonViCungCap,
          code: element.orgCode,
          giatri: this.stringFormat(Math.round(element.sanLuong || 0)),
          phantram: this.stringFormat_pt(_typleLH[1]),
          tyLeSoSanh: 0,
        })
        this.dataNguonLhMonth.push(_typleLH);
      }

    } catch (error) {
      console.log(error);
    }
  }
  xulyDataYear(data) {
    try {


      this.dataNguonLhYear = [];
      this.legendYear = [];
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].sanLuong || 0;
      }
      this.summaryYear = this.stringFormat(Math.round(sum));
      for (let i = 0; i < data.length; i++) {
        let element = data[i];
        if(!element.sanLuong || element.sanLuong == "") {element.sanLuong = 0};
        let _typleLH = []
        let _phanTram = ((element.sanLuong || 0) / sum) * 100;
        _typleLH[0] = `${element.tenDonViCungCap}`;
        _typleLH[1] = parseFloat(_phanTram.toFixed(2));
        this.legendYear.push({
          color: this.charColor[i],
          loai: element.tenDonViCungCap,
          code: element.orgCode,
          giatri: this.stringFormat(Math.round(element.sanLuong || 0)),
          phantram: this.stringFormat_pt(_typleLH[1]),
          tyLeSoSanh: 0,
        })
        this.dataNguonLhYear.push(_typleLH);
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateChartNgay() {
    this.highchartNgay.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionNgay = {
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
            font-size: 30px;
            line-height: 54px;
            color: #CE7A58;">${this.summary}</p>
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
              return ` <span style="font-size:12px!important">${this.key}</span><br/>`
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
        data: this.dataNguonLhNgay,
      }]
    };
  }
  updateChartMonth() {
    this.highchartThang.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionThang = {
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
            font-size: 30px;
            line-height: 54px;
            color: #CE7A58;">${this.summaryMonth}</p>
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
              return ` <span style="font-size:12px!important">${this.key}</span><br/>`
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
        data: this.dataNguonLhMonth,
      }]
    };
  }

  updateChartYear() {
    this.highchartNam.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionNam = {
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
            font-size: 30px;
            line-height: 54px;
            color: #CE7A58;">${this.summaryYear}</p>
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
              return ` <span style="font-size:12px!important">${this.key}</span><br/>`
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
        data: this.dataNguonLhYear,
      }]
    };
  }
}
