declare var require: any;
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';

import * as Highcharts from 'highcharts';
import MapModule from 'highcharts/modules/map';
import { Options } from "highcharts";
import map from 'highcharts/modules/map'
import { Route, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
const VietNam = require('@highcharts/map-collection/countries/vn/vn-all.geo.json');
MapModule(Highcharts);

interface iCQHC {
  maDvqly: string;
  tenTinh: string;
  sluongT: number;
  sluongCkyT: number;
  sluongG: number;
  sluongCkyG: number;
  nhom: string;
  soKhSdT: number;
  soKhSdG: number;
  thang: number;
  nam: number;
}
@Component({
  selector: 'app-dh3008-ttai-3mien.component',
  templateUrl: './dh3008-ttai-3mien.component.html',
  styleUrls: ['./dh3008-ttai-3mien.component.css']
})
export class Dh3008TruyenTai3MienComponent implements OnInit {

  dataTKD: any;
  optionTKD: any;

  highchartAPhat = Highcharts;
  highchartPMax = Highcharts;
  chartOptionsAPhat: any;
  chartOptionsPMax: any;

  isLoading: boolean = false;
  dDateSelected: Date;
  date_has_value: Date;
  dataLable: any = [];
  dataAphat: any = [];
  dataPMax: any = [];

  updateFlag = false;
  chartCallback;
  constructor(public service: CommonService, private utility: Utility, private messageService: MessageService, private datePipe: DatePipe) {

  }

  ngOnInit() {
    let today = new Date();
    this.dDateSelected = new Date(2021, 2, 30);
    this.setInit();
    this.date_has_value = this.dDateSelected;
    this.getDataTKD_highCharts();
  }
  setInit() {
  }
  onSelectDate(event) {
    this.getDataTKD_highCharts();
  }

  async getDataTKD_highCharts() {
    this.isLoading = true;
    let res;
    res = await this.service.getDataAsync(this.utility.Get_A0_TruyenTai3Mien(this.datePipe.transform(this.dDateSelected, "dd-MM-yyyy")));

    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Truyền tải 3 miền ${this.datePipe.transform(this.dDateSelected, "dd/MM/yyyy")}`
      });
      this.dDateSelected = this.date_has_value;
      this.isLoading = false;
      return;
    }
    let _sum = 0;
    for (let i = 0; i < res.length; i++) {
      _sum += res[i].aPhat;
    }
    if (_sum == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Truyền tải 3 miền ${this.datePipe.transform(this.dDateSelected, "dd/MM/yyyy")}`
      });
      this.dDateSelected = this.date_has_value;
      this.isLoading = false;
      return;
    }
    this.date_has_value = this.dDateSelected;
    this.xulyData(res);
    this.updateChartAPhat();
    this.updateChartPMax();
    this.isLoading = false;

  }
  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  xulyData(data) {
    this.dataLable = [];
    this.dataAphat = [];
    this.dataPMax = [];

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.dataAphat.push(Math.round(element.aPhat));
      this.dataPMax.push(Math.round(element.pMax));
      this.dataLable.push(element.maTruyenTai);
    }
  }

  updateChartAPhat() {
    this.chartOptionsAPhat = {
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
        // Tình hình sử dụng điện khách hàng cơ quan hành chính tháng ${this.dDateSelected.getMonth()+1} năm ${this.dDateSelected.getFullYear()} </span>`
      },
      legend: {
        enabled: false,
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      xAxis: {
        categories: this.dataLable,
        title: {
          text: null
        },
        labels: {
          enabled: true,
          skew3d: true,
          // rotation: -90,
          style: {
            textOverflow: "none",
            fontWeight: 'bold',
          },
          formatter: function () {
            let temp = this.value;
            return `<span style="font-family: Montserrat;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;color: #515151;">${temp}</span>`;
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          // useHTML: true,
          // text: `<span style="font-weight:bold">(số khách hàng)</span>`,
          text: ""
        },
        labels: {
          overflow: 'justify',
          style: {
            color: '#8C8C8C'
          },
          formatter: function () {
            let temp = this.value;
            temp = temp.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`;
          }
        },

      },
      tooltip: {
        // valueSuffix: ' số khách hàng'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} số khách hàng`
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            align: 'center',
            // inside: true,
            // rotation: -90,
            color: '#8C8C8C',
            borderColor: '#8C8C8C',
            useHTML: true,
            formatter: function () {
              let temp = this.y;
              temp = temp.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              return `<span style="font-weight:bold; font-family: Oswald;
              font-style: normal;
              font-weight: 600;
              font-size: 28px; color: #F39738">${temp}</span>`
            },
            x: 2,
            y: -10
          },
          // pointPadding: 0.1,
          // groupPadding: 0
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Biểu đồ A Phát',
          color: '#F39738',
          type: 'column',
          data: this.dataAphat
        },
      ]
    };
  }

  updateChartPMax() {
    this.chartOptionsPMax = {
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
      },
      legend: {
        enabled: false,
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      xAxis: {
        categories: this.dataLable,
        title: {
          text: null
        },
        labels: {
          enabled: true,
          skew3d: true,
          // rotation: -90,
          style: {
            textOverflow: "none",
            fontWeight: 'bold',
          },
          formatter: function () {
            let temp = this.value;
            return `<span style="font-family: Montserrat;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;color: #515151;">${temp}</span>`;
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          // useHTML: true,
          // text: `<span style="font-weight:bold">(số khách hàng)</span>`,
          text: ""
        },
        labels: {
          overflow: 'justify',
          style: {
            color: '#8C8C8C'
          },
          formatter: function () {
            let temp = this.value;
            temp = temp.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`;
          }
        },

      },
      tooltip: {
        // valueSuffix: ' số khách hàng'
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} số khách hàng`
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            align: 'center',
            // inside: true,
            // rotation: -90,
            color: '#8C8C8C',
            borderColor: '#8C8C8C',
            useHTML: true,
            formatter: function () {
              let temp = this.y;
              temp = temp.toString().replace('.', ',');
              temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              return `<span style="font-weight:bold; font-family: Oswald;
              font-style: normal;
              font-weight: 600;
              font-size: 28px; color: #219653">${temp}</span>`
            },
            x: 2,
            y: -10
          },
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Biểu đồ P Max',
          color: '#219653',
          type: 'column',
          data: this.dataPMax
        },
      ]
    };
  }
}