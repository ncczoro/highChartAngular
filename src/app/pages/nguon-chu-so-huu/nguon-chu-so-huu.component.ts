import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
highcharts3D(Highcharts);

@Component({
  selector: 'app-nguon-chu-so-huu',
  templateUrl: './nguon-chu-so-huu.component.html',
  styleUrls: ['./nguon-chu-so-huu.component.scss']
})
export class NguonChuSoHuuComponent implements OnInit {

  nguonTheoChuSoHuu: any;
  option: any;
  cols: any;
  lstSoHuu: any;

  highcharts = Highcharts;
  chartOptions: any;
  isLoading: boolean = false;
  dataSoHuu: any = [];
  today: Date = new Date();
  selectedYear: any;
  lstYear: any = [];
  charColor: any = [];
  legend: any = [];
  ckhSoHuu: boolean = false;
  summary: string;
  tyLeTangGiam: string;
  year_has_value: number;
  chenhLech = 0;
  constructor(public router: Router, public service: CommonService, private utility: Utility, private messageService: MessageService) {

  }

  ngOnInit() {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.today = new Date();
    for (let i = 2000; i <= this.today.getFullYear(); i++) {
      this.lstYear.push({ label: i, value: i });
    }
    this.selectedYear = this.today.getFullYear();
    this.year_has_value = this.selectedYear;
    this.getDataNguonSH_highChart(this.selectedYear);
  }

  onYearChange(event) {
    this.getDataNguonSH_highChart(this.selectedYear);
  }

  async getDataNguonSH_highChart(nam) {

    this.isLoading = true;
    const res = await this.service.getDataAsync(this.utility.GetTyLeNguonChuSoHuu(nam));
    const resLY = await this.service.getDataAsync(this.utility.GetTyLeNguonChuSoHuu(nam - 1));
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Cơ cấu nguồn điện theo chủ sở hữu ${this.selectedYear}!`
      });
      this.selectedYear = this.year_has_value;
      this.isLoading = false;
      return;
    }
    this.year_has_value = this.selectedYear
    this.xulyData(res, resLY);
    this.updateChart();
    this.isLoading = false;
    // console.log("nguon so huu", res)
  }

  xulyData(data, dataLastYear) {
    try {

      this.dataSoHuu = [];
      this.legend = [];
      let sum = 0;
      let sumLY = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].giaTri;
      }
      for (let i = 0; i < dataLastYear.length; i++) {
        sumLY += dataLastYear[i].giaTri;
      }
      if(sum.toString().includes('.')) {
        this.summary = this.stringFormat(sum.toFixed(3));
      } else {
        this.summary = this.stringFormat(sum);
      }
      this.chenhLech = ((sum - sumLY) / sumLY) * 100;
      this.tyLeTangGiam = this.stringFormat(this.chenhLech.toFixed(2));
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let _typleLH = []
        let _phanTram = (element.giaTri / sum) * 100;
        _typleLH[0] = `${element.chuSoHuu}`;
        _typleLH[1] = parseFloat(_phanTram.toFixed(2));
        this.legend.push({
          color: this.charColor[i],
          loai: element.chuSoHuu,
          code: element.code,
          giatri: this.stringFormat(element.giaTri),
          giatriPure: element.giaTri,
          phantram: this.stringFormat_pt(_typleLH[1]),
          tyLeSoSanh: 0
        })
        this.dataSoHuu.push(_typleLH);
      }

      for (let i = 0; i < dataLastYear.length; i++) {
        const lastYear = dataLastYear[i];
        this.legend.forEach(element => {
          if (element.code === lastYear.code) {
            let _tyle = ((element.giatriPure - lastYear.giaTri) / lastYear.giaTri) * 100;
            console.log("ttet", _tyle)
            element.tyLeSoSanh = _tyle;
          }
        });
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  textSum() {
    if (this.chenhLech >= 0) {
        return this.service.currentVersion == 'EVN' ? `
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        height: 10px;
        color: #CE7A58;"> <i class="fa fa-fw ui-icon-arrow-drop-up" style="font-size:40px;font-weight: 900;color:#219653"></i>
        ${this.tyLeTangGiam}%</p>
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 54px;
        color: #CE7A58;">${this.summary} MW</p>
        ` :
            `
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        height: 10px;
        color: #CE7A58;"><i class="fa fa-fw ui-icon-arrow-drop-up" style="font-size:40px;font-weight: 900;color:#219653"></i>
        ${this.tyLeTangGiam}%</p>
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        line-height: 54px;
        color: #CE7A58;">${this.summary} MW</p>
        `
    }
    return this.service.currentVersion == 'EVN' ? `
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        height: 10px;
        color: #CE7A58;"> <i class="fa fa-fw ui-icon-arrow-drop-down" style="font-size:40px;font-weight: 900;color:#ED5050"></i>
        ${this.tyLeTangGiam}%</p>
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 20px;
        line-height: 54px;
        color: #CE7A58;">${this.summary} MW</p>
        ` :
            `
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        height: 10px;
        color: #CE7A58;"><i class="fa fa-fw ui-icon-arrow-drop-down" style="font-size:40px;font-weight: 900;color:#ED5050"></i>
        ${this.tyLeTangGiam}%</p>
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        line-height: 54px;
        color: #CE7A58;">${this.summary} MW</p>
        `
  }
  updateChart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        useHTML: true,
        text: this.textSum(),
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
            style: {
              color: '#515151',
              fontsize: '12px',
              width: '100px'
            },
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return ` <span style="font-size:12px!important">${this.key}</span><br/>`
            },
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '130%',
        }
      },
      series: [{
        type: 'pie',
        name: 'Tỷ lệ',
        innerSize: '50%',
        data: this.dataSoHuu,
      }]
    };
    // this.chartOptions = {
    //   chart: {
    //     type: 'pie',
    //     options3d: {
    //       enabled: true,
    //       alpha: 65,
    //       beta: 0,
    //     }
    //   },
    //   title: {
    //     useHTML: true,
    //     text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;">CƠ CẤU NGUỒN ĐIỆN THEO CHỦ SỞ HỮU NĂM ${this.selectedYear} (MW)</span>`

    //   },
    //   tooltip: {
    //     // pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
    //     formatter: function () {
    //       let temp = this.y
    //       temp = temp.toString().replace('.', ',');
    //       return ` <span>${this.key} MW</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
    //     }
    //   },
    //   plotOptions: {
    //     pie: {
    //       allowPointSelect: true,
    //       cursor: 'pointer',
    //       depth: 35,
    //       dataLabels: {
    //         enabled: true,
    //         // format: '{point.name} ({point.percentage:.2f}%)',
    //         formatter: function () {
    //           let temp = this.y
    //           temp = temp.toString().replace('.', ',');
    //           return ` <span>${this.key}</span><br/> (${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%)`
    //         },
    //         style: {
    //           color: '#8C8C8C',
    //           fontsize: '11',
    //           width: '80px'
    //         }
    //       }
    //     }
    //   },
    //   series: [{
    //     type: 'pie',
    //     name: 'Tỷ lệ',
    //     data: this.dataSoHuu
    //   }]
    // };
  }

  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  stringFormat_pt(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.').concat('%');
  }

  // getDataNguonSH() {
  //   this.nguonTheoChuSoHuu = {
  //     labels: ['EVN 21.7%', 'GENCOs 31.9%', 'PVN 8.1%', 'TKV 3.4%', 'BOT 7%', 'Nhập khẩu 1%', 'CĐT khác 27%'],
  //     datasets: [
  //       {
  //         data: [21.7, 31.9, 8.1, 3.4, 7, 1, 27],
  //         backgroundColor: [
  //           '#0b84a5',
  //           '#f6c85f',
  //           '#6f4e7c',
  //           '#9dd866',
  //           '#ca472f',
  //           '#ffa056',
  //           '#8dddd0',
  //         ],
  //         hoverBackgroundColor: [
  //           '#0b84a5',
  //           '#f6c85f',
  //           '#6f4e7c',
  //           '#9dd866',
  //           '#ca472f',
  //           '#ffa056',
  //           '#8dddd0',
  //         ]
  //       }]
  //   };
  //   this.option = {
  //     tooltips: {
  //       callbacks: {
  //         label: (tooltipItem, data) => {
  //           return data.labels[tooltipItem.index]
  //         }
  //       }
  //     },
  //     legend: {
  //       display: true,
  //       position: 'bottom'
  //     }
  //   }
  // }

}
