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
  selector: 'app-dh3008-hdong-nguon-so-huu',
  templateUrl: './dh3008-hdong-nguon-so-huu.component.html',
  styleUrls: ['./dh3008-hdong-nguon-so-huu.component.css']
})
export class Dh3008HdongNguonSoHuuComponent implements OnInit {

  highchartKhac = Highcharts;
  chartOptionKhac: any;

  highchartEVN = Highcharts;
  chartOptionEVN: any;

  isLoading: boolean = false;
  today: Date = new Date();

  lstYear: any = [];
  selectedYear: any;
  dataNguonSHKhac: any = [];
  dataNguonSHEVN: any = [];
  yearHasValue: any;
  summaryKhac: string;
  summaryEVN: string;
  legendKhac: any = [];
  legendEVN: any = [];
  charColor: any = [];

  constructor(private router: Router, public service: CommonService,
    private utility: Utility, private messageService: MessageService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.today = new Date();
    for (let i = 2000; i <= this.today.getFullYear(); i++) {
      this.lstYear.push({ label: i, value: i });
    }
    this.selectedYear = this.today.getFullYear() -1;
    this.yearHasValue = this.selectedYear;
    this.getDataHDongNguonSHuu(this.selectedYear);
  }
  onYearChange(event) {
    this.getDataHDongNguonSHuu(this.selectedYear);

  }

  async getDataHDongNguonSHuu(nam) {
    try {
      this.isLoading = true;
      const res = await this.service.getDataAsync(this.utility.GetTyLeNguonChuSoHuu(nam));

      if (res && res.length == 0) {
        this.messageService.add({
          severity: "warn",
          summary: "Không có dữ liệu!",
          detail: `Cơ cấu huy động nguồn theo chủ sở hữu ${this.selectedYear}!`
        });
        this.selectedYear = this.yearHasValue;
        this.isLoading = false;
        return;
      }
      this.yearHasValue = this.selectedYear;
      this.xulyData(res);
      this.updateChart();
      this.updateChartEVN();
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

  xulyData(data) {
    try {
      this.dataNguonSHKhac = [];
      this.dataNguonSHEVN = [];
      this.legendKhac = [];
      this.legendEVN = [];
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].giaTri;
      }
     
      if(sum.toString().includes('.')) {
        this.summaryEVN = this.stringFormat(sum.toFixed(3));
        this.summaryKhac = this.stringFormat(sum.toFixed(3));
      } else {
        this.summaryEVN = this.stringFormat(sum);
        this.summaryKhac = this.stringFormat(sum);
      }
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let _typleLH = []
        let _phanTram = (element.giaTri / sum) * 100;
        _typleLH[0] = `${element.chuSoHuu}`;
        _typleLH[1] = parseFloat(_phanTram.toFixed(2));
        this.legendKhac.push({
          color: this.charColor[i],
          loai: element.chuSoHuu,
          code: element.code,
          giatri: this.stringFormat(element.giaTri),
          phantram: this.stringFormat_pt(_typleLH[1]),

        })
        this.legendEVN.push({
          color: this.charColor[i],
          loai: element.chuSoHuu,
          code: element.code,
          giatri: this.stringFormat(element.giaTri),
          phantram: this.stringFormat_pt(_typleLH[1]),

        })
        this.dataNguonSHEVN.push(_typleLH);
        this.dataNguonSHKhac.push(_typleLH);
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateChart() {
    this.highchartKhac.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionKhac = {
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
            color: #CE7A58;">${this.summaryKhac}</p>
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
        data: this.dataNguonSHKhac,
      }]
    };
  }

  updateChartEVN() {
    this.highchartEVN.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionEVN = {
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
            color: #CE7A58;">${this.summaryEVN}</p>
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
        data: this.dataNguonSHEVN,
      }]
    };
  }

}
