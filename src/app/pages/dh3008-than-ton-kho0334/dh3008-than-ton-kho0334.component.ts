import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
import { LoadingComponent } from '../loading/loading.component'
import { fromEventPattern } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
// import * as highchartsTreemap from 'highcharts/modules/treemap';
// highchartsTreemap(Highcharts);

export interface iPhuTai {
  mien: string,
  ngay: string,
  thoiDiem: Date,
  giaTri: number
}

@Component({
  selector: 'app-dh3008-than-ton-kho0334',
  templateUrl: './dh3008-than-ton-kho0334.component.html',
  styleUrls: ['./dh3008-than-ton-kho0334.component.css']
})
export class Dh3008ThanTonKho0334Component implements OnInit {

  highcharts = Highcharts;
  chartOptions: any;
  today: Date = new Date();
  dataQG: number[] = [];
  dataBac: number[] = [];
  dataTrung: number[] = [];
  dataNam: number[] = [];
  pMax: string;
  isLoading: boolean = false;
  dTonKho: Date;
  dHasValue: Date;
  iTQ_max: number;
  iNam_max: number;
  iBac_max: number;
  iTrung_max: number;
  charColor: any = [];

  constructor(public service: CommonService, private utility: Utility,
    private messageService: MessageService, private router: Router,
    private datePipe: DatePipe) { }

  ngOnInit() {
    let today = new Date();
    this.charColor = ['#5899DA', '#F39738', '#9CDAE0', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#F17C7C', '#EFD273', '#F9CB9C', '#CE7A58', '#4A9AA1', '#B19AD7', '#6BC7D1', '#59B07E', '#ED5050']
    this.dTonKho = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    this.dHasValue = this.dTonKho;
    this.getDataThanTonKho();
  }

  onSelectDate(event) {
    this.getDataThanTonKho();
  }
  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  async getDataThanTonKho() {
    this.isLoading = true;
    let url = this.utility.GetPhuTai(this.datePipe.transform(this.dTonKho, "yyyy-MM-dd"));
    const res = await this.service.getDataAsync(url);
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Kh??ng c?? d??? li???u!",
        detail: `Ph??? t???i ng??y ${this.datePipe.transform(this.dTonKho, "dd/MM/yyyy")}`
      });
      this.dTonKho = this.dHasValue;
      this.isLoading = false;
      return;
    }
    this.dHasValue = this.dTonKho;
    // console.log("Phu Tai", res);
    this.xulyData(res);
    this.updateChart();
    this.isLoading = false;
  }

  xulyData(data) {
    this.dataQG = []; this.dataBac = []; this.dataNam = []; this.dataTrung = [];
    let quocGia = data.filter(p => p.mien.indexOf("gia") > 0);
    quocGia.forEach(element => {
      this.dataQG.push(element.giaTri)
    });
    this.iTQ_max = Math.max(...this.dataQG);

    let bac = data.filter(p => p.mien == "B???c");
    bac.forEach(element => {
      this.dataBac.push(element.giaTri)
    });
    this.iBac_max = Math.max(...this.dataBac);

    let trung = data.filter(p => p.mien == "Trung")
    trung.forEach(element => {
      this.dataTrung.push(element.giaTri)
    });
    this.iTrung_max = Math.max(...this.dataTrung);

    let nam = data.filter(p => p.mien == "Nam");
    nam.forEach(element => {
      this.dataNam.push(element.giaTri)
    });
    this.iNam_max = Math.max(...this.dataNam);
  }

  updateChart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      },
      colors: this.charColor
    });
    this.chartOptions = {
      chart: {
        type: 'column',
      //   options3d: {
      //     enabled: true,
      //     alpha: 15,
      //     beta: 15,
      //     viewDistance: 25,
      //     depth: 40
      // }
      },
      title: {
        text: ""
      },
      xAxis: {
        categories: ['Duy??n H???i 1', 'Duy??n H???i 3', 'Duy??n H???i MR3', 'V??nh T??n 4', 'Nghi S??n', 'Qu???ng Ninh', 'U???ng B?? 1', 'U??ng B?? 2', 'Ph??? L???i 1', 'Ph??? L???i 2', 'H???i Ph??ng 1', 'H???i Ph??ng 2', 'M??ng D????ng', 'Ninh B??nh', ' Th??i B??nh'],
        labels: {
          overflow: 'justify',
          formatter: function () {
            console.log(this)
            let temp = this.value
            return `<span style="font-weight:bold; font-size:12px">${temp}</span>`
          }
        }
      },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold">Than cung c???p (t???n)</span>`
        },
        // tickInterval: 3000,
        labels: {
          formatter: function () {
            // console.log(this)
            let temp = this.value
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold; font-size:12px">${temp}</span>`
          }
        }
        // min: 1,
        // minorGridLineWidth: 1,
        // gridLineWidth: 1,
        // alternateGridColor: null,
      },
      tooltip: {
        valueSuffix: ' t???n',
        shared: true,
        headerFormat: '<span style="font-size: 15px">{point.point.name}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y} </b><br/>'
        // formatter: function () {
        //   let temp = this.y
        //   temp = temp.toString().replace('.', ',');
        //   return ` <span>${this.x}h</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} t???n`
        // }
      },
      plotOptions: {
        series: {
          grouping: false,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Duy??n H???i 1 ?????nh m???c',
          color: '#ADBCC3',
          pointPlacement: -0.2,
          linkedTo: 'DH1DM',
          data: [
            ['Duy??n H???i 1', 10,],
            ['Duy??n H???i 3', 43],
            ['Duy??n H???i MR3', 32],
            ['V??nh T??n 4', 11],
            ['Duy??n H???i 1', 24],
            ['Duy??n H???i 1', 38],
            ['Duy??n H???i 1', 29],
            ['Duy??n H???i 1', 46],
            ['Duy??n H???i 1', 46],
            ['Duy??n H???i 1', 46],
            ['Duy??n H???i 1', 46],
            ['Duy??n H???i 1', 46],
            ['Duy??n H???i 1', 46],
            ['Duy??n H???i 1', 46],
            ['Duy??n H???i 1', 46],
          ],
        },
        {
          id: 'DH1DM',
          name: 'Duy??n H???i 1',
          // dataSorting: {
          //   enabled: true,
          //   matchByName: true
          // },
          dataLabels: [{
            enabled: true,
            inside: true,
            style: {
              fontSize: '16px'
            },
          }],
          data: [
            { name: 'Duy??n H???i 1',y: 13, color: this.charColor[0]},
            { name: 'Duy??n H???i 1',y: 32, color: this.charColor[2]},
            { name: 'Duy??n H???i 1',y: 31, color: this.charColor[3]},
            { name: 'Duy??n H???i 1',y: 11, color: this.charColor[4]},
            { name: 'Duy??n H???i 1',y: 56, color: this.charColor[5]},
            { name: 'Duy??n H???i 1',y: 43, color: this.charColor[6]},
            { name: 'Duy??n H???i 1',y: 67, color: this.charColor[7]},
            { name: 'Duy??n H???i 1',y: 21, color: this.charColor[8]},
            { name: 'Duy??n H???i 1',y: 31, color: this.charColor[9]},
            { name: 'Duy??n H???i 1',y: 12, color: this.charColor[10]},
            { name: 'Duy??n H???i 1',y: 75, color: this.charColor[11]},
            { name: 'Duy??n H???i 1',y: 31, color: this.charColor[12]},
            { name: 'Duy??n H???i 1',y: 11, color: this.charColor[13]},
            { name: 'Duy??n H???i 1',y: 13, color: this.charColor[14]},
            { name: 'Duy??n H???i 1',y: 35, color: this.charColor[15]},
          ]
        },
      ],
      exporting: {
        allowHTML: true
      },
    };
  }


}
