import { Component, OnInit } from '@angular/core';
import { NguonLoaiHinh } from 'src/app/model/model';
import highcharts3D from 'highcharts/highcharts-3d';
import * as Highcharts from 'highcharts/highcharts'
highcharts3D(Highcharts);
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
import { CtietKehoachDautuComponent } from './ctiet-kehoach-dautu/ctiet-kehoach-dautu.component';
import { TTIN_DAUTU } from './ctiet-kehoach-dautu/model-dautu-xaydung-ctiet';
import { DAUTU_THUAN_CTIET } from './ctiet-kehoach-dautu/model-dautu-xaydung-ctiet';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/primeng';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dautu-xaydung-dh3008',
  templateUrl: './dautu-xaydung-dh3008.component.html',
  styleUrls: ['./dautu-xaydung-dh3008.component.css']
})
export class DautuXaydungDh3008Component implements OnInit {
  highchartDTXD = Highcharts;
  chartOptions: any;
  chartOptionDTXD: any;
  lableChart: any[] = [];
  dataChart: any[] = [];
  dNamHTai: Date;
  isLoading: boolean = false;
  lstBieu1D: any[] = [];
  lstBieu2D: any[] = []
  lstTTinDauTu: Array<TTIN_DAUTU> = [];
  lstCTy: any[] = [];
  sCTy: any[] = [];
  today = new Date();
  charColor: any = [];
  constructor(private router: Router, public service: CommonService, private utility: Utility, private messageService: MessageService, private datePipe: DatePipe) {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.dNamHTai = new Date();
    this.dNamHTai.setMonth(2);
    this.dNamHTai.setFullYear(this.today.getFullYear());
    this.lstCTy = [
      { value: 0, label: 'Tất cả' },
      { value: 1, label: 'Công ty mẹ' },
      { value: 15000, label: 'EVNNPT' },
      { value: 20000, label: 'GENCO1' },
      { value: 30000, label: 'GENCO2' },
      { value: 40000, label: 'GENCO3' },
      { value: 50000, label: 'EVNNPC' },
      { value: 60000, label: 'EVNSPC' },
      { value: 70000, label: 'EVNCPC' },
      { value: 80000, label: 'EVNHANOI' },
      { value: 90000, label: 'EVNHCMC' },

    ]
    this.sCTy = this.lstCTy[0].value;
  }

  async ngOnInit() {
    await this.getDataDauTu();
  }
  onSelectDate(event) {
    this.getDataDauTu();
  }
  onChangeCTy(event) {
    this.getDataDauTu();
  }

  async getDataDauTu() {
    try {
      this.lstBieu1D = [];
      this.lstBieu2D = [];
      let param = {
        NAM: this.dNamHTai.getFullYear(),
        THANG: this.dNamHTai.getMonth() + 1,
        DONVI: this.sCTy
      }
      this.isLoading = true;
      let response = await this.service.getDataAsync(this.utility.Get_Dtxd_Ke_Hoach_Dau_Tu(param));
      this.isLoading = false;
      if ((response && response.length == 0) || !response.lstBieu1Dtxd || response.lstBieu1Dtxd.length == 0) {
        this.messageService.add({
          severity: "warn",
          summary: "Không có dữ liệu!",
          detail: `Báo cáo tổng quan kế hoạch đầu tư ${this.datePipe.transform(this.dNamHTai, "MM/yyyy")}!`
        });
        this.isLoading = false;
        this.lstTTinDauTu = undefined;
        this.dataChart = [];
        return;
      }
      this.lstBieu1D = response.lstBieu1Dtxd;
      this.lstBieu2D = response.lstBieu2Dtxd;
      this.setDataTable();
      this.setDataChart();
      this.updateChartDTXD();
    } catch (error) {
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }


  async setDataTable() {
    this.lstTTinDauTu = [];
    let dmucTTin = [
      {
        ID: 0,
        NAME: 'Kế hoạch vốn',
        KEY: 'khCcTongSo'
      },
      {
        ID: 1,
        NAME: 'Thực hiện',
        KEY: 'thNamCcTongSo'
      },
      {
        ID: 2,
        NAME: 'Phiếu giá',
        KEY: 'pgNamCcTongSo'
      },
      {
        ID: 3,
        NAME: 'Giải ngân',
        KEY: 'gnNamCcTongSo'
      }

    ]
    this.lstTTinDauTu = new Array<TTIN_DAUTU>();
    for (let index = 0; index < 4; index++) {
      let objectTTIn = new TTIN_DAUTU();
      objectTTIn.LOAI_CVIEC = dmucTTin[index].NAME;
      let filed = dmucTTin[index].KEY;
      let lstTraNoGV = this.lstBieu1D.filter(x => x.idLoaiHinhDk == 3)
      if (lstTraNoGV.length > 0) {
        objectTTIn.TRANO_GOCVAY = Math.round(lstTraNoGV.map(x => Number(x[filed])).reduce((a, b) => a + b));
      } else {
        objectTTIn.TRANO_GOCVAY = 0
      }

      let lstGopVonHT = this.lstBieu1D.filter(x => x.idLoaiHinhDk == 2)
      if (lstGopVonHT.length > 0) {
        objectTTIn.GOPVON_HTRA = Math.round(lstGopVonHT.map(x => Number(x[filed])).reduce((a, b) => a + b));
      } else {
        objectTTIn.GOPVON_HTRA = 0;
      }

      let lstDauTuThuan = this.lstBieu1D.filter(x => x.idLoaiHinhDk == 1);
      let dtt_ctiet = new DAUTU_THUAN_CTIET();

      if (lstDauTuThuan.length > 0) {
        let lstNgDien = lstDauTuThuan.filter(x => x.idLoaiHinhDa == 1);
        let lst500KV = lstDauTuThuan.filter(x => x.idLoaiHinhDa == 2);

        let lst220KV = lstDauTuThuan.filter(x => x.idLoaiHinhDa == 3);
        let lst110KV = lstDauTuThuan.filter(x => x.idLoaiHinhDa == 4);
        let lstTHT = lstDauTuThuan.filter(x => x.idLoaiHinhDa == 5);
        let lstDuAnKhac = lstDauTuThuan.filter(x => x.idLoaiHinhDa == 6);

        dtt_ctiet.NGUON_DIEN = lstNgDien.length > 0 ? Math.round(lstNgDien.map(x => Number(x[filed]))[0]) : 0;
        dtt_ctiet.LUOI_DIEN_500KV = lst500KV.length > 0 ? Math.round(lst500KV.map(x => Number(x[filed]))[0]) : 0;
        dtt_ctiet.LUOI_DIEN_220KV = lst220KV.length > 0 ? Math.round(lst220KV.map(x => Number(x[filed]))[0]) : 0;
        dtt_ctiet.LUOI_DIEN_110KV = lst110KV.length > 0 ? Math.round(lst110KV.map(x => Number(x[filed]))[0]) : 0;
        dtt_ctiet.LUOI_DIEN_THT = lstTHT.length > 0 ? Math.round(lstTHT.map(x => Number(x[filed]))[0]) : 0;
        dtt_ctiet.DU_AN_KHAC = lstDuAnKhac.length > 0 ? Math.round(lstDuAnKhac.map(x => Number(x[filed]))[0]) : 0;
        // objectTTIn.DAUTU_THUAN = Number(lstDauTuThuan.map(x => Number(x[filed])).reduce((a, b) => a + b).toFixed(2));
        objectTTIn.DAUTU_THUAN = Number(dtt_ctiet.NGUON_DIEN + dtt_ctiet.LUOI_DIEN_500KV + dtt_ctiet.LUOI_DIEN_220KV + dtt_ctiet.LUOI_DIEN_110KV + dtt_ctiet.LUOI_DIEN_THT + dtt_ctiet.DU_AN_KHAC);


      } else {
        objectTTIn.DAUTU_THUAN = 0;
        dtt_ctiet.NGUON_DIEN = 0;
        dtt_ctiet.LUOI_DIEN_500KV = 0;
        dtt_ctiet.LUOI_DIEN_220KV = 0;
        dtt_ctiet.LUOI_DIEN_110KV = 0;
        dtt_ctiet.LUOI_DIEN_THT = 0;
        dtt_ctiet.DU_AN_KHAC = 0;

      }
      objectTTIn.DAUTU_THUAN_CTIET = dtt_ctiet;
      let abc = Number(this.lstBieu1D.map(x => Number(x[filed])).reduce((a, b) => a + b).toFixed(2));
      objectTTIn.TONG = Number(objectTTIn.TRANO_GOCVAY + objectTTIn.GOPVON_HTRA + objectTTIn.DAUTU_THUAN);

      this.lstTTinDauTu.push(objectTTIn);
    }

  }
  setDataChart() {
    this.dataChart = [];
    this.lableChart = this.lstBieu2D.map(x => x.tenDonVi)
    let dmucChart = [
      {
        id: 0,
        name: 'Kế hoạch vốn giao',
        color: this.charColor[0],
        key: 'khCcTongSo'
      }, {
        id: 1,
        name: 'Lũy kế thực hiện',
        color: this.charColor[1],
        key: 'thNamCcTongSo'

      }, {

        id: 2,
        name: 'Lũy kế phiếu giá',
        color: this.charColor[2],
        key: 'pgNamCcTongSo'

      }, {
        id: 3,
        name: 'Lũy kế giải ngân',
        color: this.charColor[3],
        key: 'gnNamCcTongSo'

      }
    ]
    for (let index = 0; index < 4; index++) {
      let data: any[] = [];
      this.lableChart.forEach(element => {
        let lstDataFilter = this.lstBieu2D.filter(x => x.tenDonVi == element);
        if (lstDataFilter.length > 0) {
          data.push(Math.round(lstDataFilter[0][dmucChart[index].key]));

        } else {
          data.push(0);
        }
      });
      let objectLoaiLK = {
        name: dmucChart[index].name,
        data: data,
        color: dmucChart[index].color,
      }
      this.dataChart.push(objectLoaiLK)

    }


  }
  updateChartDTXD() {
    this.highchartDTXD.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionDTXD = {
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
      xAxis: {
        categories: this.lableChart,
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
          text: `<span style="font-weight:bold">triệu đồng</span>`,
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
        formatter: function () {
          let temp = this.y
          temp = temp.toString().replace('.', ',');
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} triệu đồng`
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
            formatter: function () {
              let temp = this.y
              temp = temp.toString().replace('.', ',');
              return `${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
            }

          }
        }
      },
      series: this.dataChart
    };
  }

}
