import { Component, OnInit } from '@angular/core';
import { NguonLoaiHinh } from 'src/app/model/model';
import highcharts3D from 'highcharts/highcharts-3d';
import * as Highcharts from 'highcharts/highcharts'
highcharts3D(Highcharts);
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-chitieu-kinhdoanh-toanevn',
  templateUrl: './chitieu-kinhdoanh-toanevn.component.html',
  styleUrls: ['./chitieu-kinhdoanh-toanevn.component.css']
})
export class ChitieuKinhdoanhToanevnComponent implements OnInit {

  isLoading: boolean = false;
  selectedYear: Date;
  year_has_value: any;
  lstYear: any = [];
  today: Date = new Date();
  charColor: any = [];
  lstDataTable: any[] = []
  highcharts = Highcharts;
  chartOptions: any;
  chartOptionsDThu: any;
  chartOptionsHDMBD: any;
  chartOptions385: any;
  chartOptionsGiaBQ: any
  dataTP: any[] = [];
  lstData: any[] = [];
  dataDThu: any[] = [];
  dataHDMBD: any[] = [];
  loaiBcao: number;
  lstLoaiBCao: any[] = [];
  iThangHT: number;
  iNamHT: number;
  lstDataCTieu: any[] = [];
  lstDataKH: any[] = [];

  tongDienTP: number = 0;
  tongDThu: number = 0;
  tongSoHDMBD: number = 0;
  dataLabelGiaBQ: any[] = [];
  dataLabel385: any[] = [];
  dataLabel1508: any[] = [];

  data1508: any[] = []
  dataBQuanCTiet: any[] = [];
  data385: any[] = [];
  chartOptions1508: any;
  dmucDvi: any[] = [];
  lstBquanTable: any[] = [];
  lstDThuTable: any[] = []
  lstTT385Table: any[] = []
  lstTT1508Table: any[] = [];

  constructor(private router: Router, public service: CommonService, private utility: Utility, private messageService: MessageService) {
    this.lstLoaiBCao = [
      { value: 0, label: 'Báo cáo tháng' },
      { value: 1, label: 'Lũy kế đến tháng' }
    ]
    this.selectedYear = new Date();
    this.loaiBcao = this.lstLoaiBCao[0].value;
    this.selectedYear.setFullYear(2021);
    this.selectedYear.setMonth(2);
    this.dmucDvi = [
      { MA_DVIQLY: 'PA', TEN_DVIQLY: 'EVN NPC' },
      { MA_DVIQLY: 'PB', TEN_DVIQLY: 'EVN SPC' },
      { MA_DVIQLY: 'PC', TEN_DVIQLY: 'EVN CPC' },
      { MA_DVIQLY: 'PD', TEN_DVIQLY: 'EVN HANOI' },
      { MA_DVIQLY: 'PE', TEN_DVIQLY: 'EVN HCMC' },
      { MA_DVIQLY: 'PW', TEN_DVIQLY: 'EVN bán trực tiếp' },
      { MA_DVIQLY: 'NPT', TEN_DVIQLY: 'NPT' },
      { MA_DVIQLY: 'E', TEN_DVIQLY: 'EVN' },
      { MA_DVIQLY: 'P', TEN_DVIQLY: 'Lưới PP' },


    ]
  }

  ngOnInit() {
    this.charColor = ['#5899DA', '#F39738', '#3AB5C2', '#EAC344', '#9685D9', '#5D6F77', '#6487A9', '#C18A51', '#EFD273', '#C1CDD2', '#F6B16A', '#4A9AA1']
    this.today = new Date();
    for (let i = 2000; i <= this.today.getFullYear(); i++) {
      this.lstYear.push({ label: i, value: i });
    }
    // this.selectedYear = this.today;
    // this.year_has_value = this.selectedYear;

    this.getDataCTieuKDoanh();

  }
  onSelectDate(event) {
    this.getDataCTieuKDoanh();
  }
  onChangeLoaiBCao(event) {
    this.getDataCTieuKDoanh();
  }

  async getDataCTieuKDoanh() {
    this.isLoading = true;

    this.iThangHT = this.selectedYear.getMonth() + 1;
    this.iNamHT = this.selectedYear.getFullYear();
    const res = await this.service.getDataAsync(this.utility.Get_Cmis_Ctieu_Kdoanh(this.iNamHT, this.iThangHT, this.loaiBcao));
    const resKH = await this.service.getDataAsync(this.utility.Get_Cmis_Kehoach_Kdoanh(this.iNamHT));

    // const res = await this.service.Get_Cmis_Ctieu_Kdoanh(this.iNamHT, this.iThangHT, this.loaiBcao);
    // const resKH = await this.service.Get_Cmis_Kehoach_Kdoanh(this.iNamHT);
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Chỉ tiêu kinh doanh ${this.iThangHT} - ${this.iNamHT} !`
      });
      // this.selectedYear = this.year_has_value;
      this.isLoading = false;
      return;
    }
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Kế hoạch kinh doanh {this.iNamHT} !`
      });
      // this.selectedYear = this.year_has_value;
      this.isLoading = false;
      return;
    }
    // this.year_has_value = this.selectedYear;
    this.lstDataCTieu = res;
    this.lstDataKH = resKH;

    await this.setDataChart();
    await this.updateChartTP();
    await this.updateChartDT();
    await this.updateChartHDMBD();
    await this.updatechartBquan();
    await this.updatechart385();
    await this.updatechart1508();
    await this.setDataTable();

  }


  stringFormat(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  stringFormat_pt(value: any) {
    value = value.toString().replace('.', ',');
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.').concat('%');
  }

  async setDataChart() {
    //
    try {
      this.dataTP = [];
      this.dataDThu = [];
      this.dataHDMBD = [];

      this.dataBQuanCTiet = [];
      this.dataLabelGiaBQ = [];

      this.data385 = [];
      this.dataLabel385 = [];

      this.data1508 = [];
      this.dataLabel1508 = [];

      this.lstBquanTable = [];
      this.lstTT385Table = [];
      this.lstTT1508Table = [];
      let lstDataKDFilter = this.lstDataCTieu.filter(x => x.maDviqly == 'PA' || x.maDviqly == 'PB' || x.maDviqly == 'PC' || x.maDviqly == 'PD' || x.maDviqly == 'PE' || x.maDviqly == 'PW');

      this.tongDienTP = lstDataKDFilter.map(x => x.dienTp).reduce((a, b) => a + b);
      this.tongDThu = lstDataKDFilter.map(x => x.tienPs).reduce((a, b) => a + b) + lstDataKDFilter.map(x => x.tienPk).reduce((a, b) => a + b);
      this.tongSoHDMBD = lstDataKDFilter.map(x => x.sohdmbd).reduce((a, b) => a + b);

      for (let index = 0; index < this.dmucDvi.length; index++) {
        let tongTyLeTP = 0;
        let tongTyLeDThu = 0;
        let tongTyLeHDMBD = 0;
        if (index == 6) break; // Chỉ lấy 6 ông đầu tiên trong this.dmucDvi
        if (index != this.dmucDvi.length - 1) {
          let dataByDvi = this.lstDataCTieu.filter(x => x.maDviqly == this.dmucDvi[index].MA_DVIQLY);
          if (dataByDvi.length > 0) {
            // Set data chart thương phẩm
            let tongTpDvi = dataByDvi.map(x => x.dienTp).reduce((a, b) => a + b);
            let tyleTP = Number(((tongTpDvi / this.tongDienTP) * 100).toFixed(2));
            tongTyLeTP = tongTyLeTP + tyleTP;
            this.dataTP.push([this.dmucDvi[index].TEN_DVIQLY, tyleTP]);
            // Set data chart doanh thu
            let tongDThuDvi = dataByDvi.map(x => x.tienPs).reduce((a, b) => a + b) + dataByDvi.map(x => x.tienPk).reduce((a, b) => a + b);
            let tyleDThu = Number(((tongDThuDvi / this.tongDThu) * 100).toFixed(2));
            tongTyLeDThu = tongTyLeDThu + tyleDThu;
            this.dataDThu.push([this.dmucDvi[index].TEN_DVIQLY, tyleDThu]);
            // Set data chart doanh thu
            let tongHDMBDvi = dataByDvi.map(x => x.sohdmbd).reduce((a, b) => a + b)
            let tyLeHDMBD = Number(((tongHDMBDvi / this.tongSoHDMBD) * 100).toFixed(2));
            tongTyLeHDMBD = tongTyLeHDMBD + tyLeHDMBD;
            this.dataHDMBD.push([this.dmucDvi[index].TEN_DVIQLY, tyLeHDMBD]);

          }

        }
        else {
          // Set data chart thương phẩm
          this.dataTP.push([this.dmucDvi[index].TEN_DVIQLY, 100 - tongTyLeTP]);
          this.dataDThu.push([this.dmucDvi[index].TEN_DVIQLY, 100 - tongTyLeDThu]);
          this.dataHDMBD.push([this.dmucDvi[index].TEN_DVIQLY, 100 - tongTyLeHDMBD]);
        }
      }

      // Set data chart giá bình quân
      let dataBQuanDVi_Chart = [];
      let dataKeHoach_Chart = [];
      let dataChart385 = [];
      let dataChart1508 = [];

      this.dmucDvi.forEach((element, index) => {
        let dataCTieuDvi = this.lstDataCTieu.filter(x => x.maDviqly == element.MA_DVIQLY)
        if (dataCTieuDvi.length > 0) {
          if (this.loaiBcao == 0) {
            let giaBquan = Number(dataCTieuDvi.map(x => x.giabq).reduce((a, b) => a + b).toFixed(2));
            if (giaBquan != 0) {
              if (element.MA_DVIQLY == 'PA' || element.MA_DVIQLY == 'PB' || element.MA_DVIQLY == 'PC' || element.MA_DVIQLY == 'PD'
                || element.MA_DVIQLY == 'PE' || element.MA_DVIQLY == 'E' || element.MA_DVIQLY == 'NPT') {
                this.dataLabelGiaBQ.push(element.TEN_DVIQLY);
                dataBQuanDVi_Chart.push(giaBquan);
                let dataKeHoach = this.lstDataKH.filter(x => x.ma_dviqly == element.MA_DVIQLY)
                if (dataKeHoach.length > 0) {
                  let giaBquanKH = dataKeHoach.map(x => x.kh_giabq).reduce((a, b) => a + b);
                  dataKeHoach_Chart.push(giaBquanKH)
                }
              }
              this.lstBquanTable.push({
                MA_DVIQLY: element.MA_DVIQLY,
                BQUAN: giaBquan
              })
            }
          }
          else {

            let lstTienPs = dataCTieuDvi.map(x => x.tienPs)
            let tienPs = lstTienPs.length > 0 ? lstTienPs.reduce((a, b) => a + b) : 0;
            let lstDienTp = dataCTieuDvi.map(x => x.dienTp);
            let sumTP = lstDienTp.length > 0 ? lstDienTp.reduce((a, b) => a + b) : 0;
            let giaBquan = Number(((tienPs) / sumTP).toFixed(2))
            if (element.MA_DVIQLY == 'PA' || element.MA_DVIQLY == 'PB' || element.MA_DVIQLY == 'PC' || element.MA_DVIQLY == 'PD'
              || element.MA_DVIQLY == 'PE' || element.MA_DVIQLY == 'E' || element.MA_DVIQLY == 'NPT') {
              this.dataLabelGiaBQ.push(element.TEN_DVIQLY);
              dataBQuanDVi_Chart.push(giaBquan);
              let dataKeHoach = this.lstDataKH.filter(x => x.ma_dviqly == element.MA_DVIQLY)
              if (dataKeHoach.length > 0) {
                let giaBquanKH = dataKeHoach.map(x => x.kh_giabq).reduce((a, b) => a + b);
                dataKeHoach_Chart.push(giaBquanKH)
              }
            }
            this.lstBquanTable.push({
              MA_DVIQLY: element.MA_DVIQLY,
              BQUAN: giaBquan
            })
          }
          // Chỉ có những mã này mới set chart 385 và 1508
          if (element.MA_DVIQLY == 'PA' || element.MA_DVIQLY == 'PB' || element.MA_DVIQLY == 'PC' || element.MA_DVIQLY == 'PD'
            || element.MA_DVIQLY == 'PE' || element.MA_DVIQLY == 'E' || element.MA_DVIQLY == 'NPT' || element.MA_DVIQLY == 'P') {
            this.dataLabel385.push(element.TEN_DVIQLY);
            this.dataLabel1508.push(element.TEN_DVIQLY);

            if (element.MA_DVIQLY == 'E' || element.MA_DVIQLY == 'P' || element.MA_DVIQLY == 'NPT') {
              let sumDnTT385 = dataCTieuDvi.map(x => x.dnTthat385).reduce((a, b) => a + b);
              let sumDnNhan1508 = dataCTieuDvi.map(x => x.dnNhan1508).reduce((a, b) => a + b);
              dataChart385.push(
                {
                  y: sumDnNhan1508 == 0 ? 0 : Number(((sumDnTT385 / sumDnNhan1508) * 100).toFixed(2)),
                  color: this.charColor[index]
                }
              );
              this.lstTT385Table.push({
                MA_DVIQLY: element.MA_DVIQLY,
                TT_385: sumDnNhan1508 == 0 ? 0 : Number(((sumDnTT385 / sumDnNhan1508) * 100).toFixed(2))
              });
            } else {
              let sumDienNh = dataCTieuDvi.map(x => x.diennh).reduce((a, b) => a + b);
              let sumDienTP = dataCTieuDvi.map(x => x.dienTp).reduce((a, b) => a + b);
              let sumDienGi = dataCTieuDvi.map(x => x.diengi).reduce((a, b) => a + b);
              let sumgiaoNgay = dataCTieuDvi.map(x => x.giaongay).reduce((a, b) => a + b);
              dataChart385.push(
                {
                  y: (sumDienNh - sumgiaoNgay) == 0 ? 0 : Number(((sumDienNh - sumDienTP - sumDienGi) / (sumDienNh - sumgiaoNgay) * 100).toFixed(2)),
                  color: this.charColor[index]
                }
              );
              this.lstTT385Table.push({
                MA_DVIQLY: element.MA_DVIQLY,
                TT_385: (sumDienNh - sumgiaoNgay) == 0 ? 0 : Number(((sumDienNh - sumDienTP - sumDienGi) / (sumDienNh - sumgiaoNgay) * 100).toFixed(2)),
              });
            }
            let sumDienNTT1508 = dataCTieuDvi.map(x => x.dnTthat1508).reduce((a, b) => a + b);
            let sumDienNNhan1508 = dataCTieuDvi.map(x => x.dnNhan1508).reduce((a, b) => a + b);
            let sumDnGiaoNgay1508 = dataCTieuDvi.map(x => x.dnGiaoNgay1508).reduce((a, b) => a + b);
            dataChart1508.push(
              {
                y: (sumDienNNhan1508 - sumDnGiaoNgay1508) == 0 ? 0 : Number((sumDienNTT1508 * 100 / (sumDienNNhan1508 - sumDnGiaoNgay1508)).toFixed(2)),
                color: this.charColor[index]
              }
            );
            this.lstTT1508Table.push({
              MA_DVIQLY: element.MA_DVIQLY,
              TT_1508: (sumDienNNhan1508 - sumDnGiaoNgay1508) == 0 ? 0 : Number((sumDienNTT1508 * 100 / (sumDienNNhan1508 - sumDnGiaoNgay1508)).toFixed(2)),
            });
          } else {
            this.lstTT385Table.push({
              MA_DVIQLY: element.MA_DVIQLY,
              TT_385: 0
            });

            this.lstTT1508Table.push({
              MA_DVIQLY: element.MA_DVIQLY,
              TT_1508: 0
            });
          }
        }

      });

      for (let index = 0; index < 2; index++) {
        let object = {
          name: index == 0 ? 'Theo tháng' : 'Kế hoạch năm',
          data: index == 0 ? dataBQuanDVi_Chart : dataKeHoach_Chart,
          color: this.charColor[index],
        }
        this.dataBQuanCTiet.push(object);
      }

      let object385 = {
        data: dataChart385,
      }
      this.data385.push(object385);
      // Set data chart tổn thất 385
      let object1508 = {
        data: dataChart1508,
      }
      this.data1508.push(object1508);

    } catch (error) {
      console.log("Lỗi", error)
    }
  }
  async updatechartBquan() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptionsGiaBQ = {
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
      },
      xAxis: {
        categories: this.dataLabelGiaBQ,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold;font-size: 9px!important">${this.value}</span>`
          }
        },
      },
      yAxis: {
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold">đồng/kWh</span>`,
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
        enabled: false,
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
          return ` <span>${this.x}</span><br/> ${this.series.name}: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đồng/kWh`
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
      series: this.dataBQuanCTiet
    }
  }
  async updatechart385() {

    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptions385 = {
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
        categories: this.dataLabel385,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold ;font-size: 9px!important">${this.value}</span>`
          }
        },
      },
      yAxis: {
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold">%</span>`,
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
        enabled: false,
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
          return ` <span>${this.x}</span>: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
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
      series: this.data385
    }
  }
  async updatechart1508() {

    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptions1508 = {
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
        categories: this.dataLabel1508,
        crosshair: true,
        labels: {
          skew3d: true,
          formatter: function () {
            return `<span style="font-weight:bold;font-size: 9px!important">${this.value}</span>`
          }
        },
      },
      yAxis: {
        title: {
          useHTML: true,
          text: `<span style="font-weight:bold">%</span>`,
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
        enabled: false,
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
          return ` <span>${this.x}</span>: ${temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}%`
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
      series: this.data1508
    }
  }
  setDataTable() {
    try {
      this.lstDataTable = [];
      let lstDmucFilter = this.dmucDvi.filter(x => x.MA_DVIQLY != 'NPT')
      lstDmucFilter.forEach(element => {
        let lstDataByDvi = this.lstDataCTieu.filter(x => x.maDviqly == element.MA_DVIQLY);
        let lstGiaBq = this.lstBquanTable.filter(x => x.MA_DVIQLY == element.MA_DVIQLY);
        let lst385 = this.lstTT385Table.filter(x => x.MA_DVIQLY == element.MA_DVIQLY);
        let tt385 = 0;
        if (lst385.length > 0) {
          tt385 = Number(lst385.map(x => x.TT_385).reduce((a, b) => a + b))
        }
        let tt1508 = 0;
        let lst1508 = this.lstTT1508Table.filter(x => x.MA_DVIQLY == element.MA_DVIQLY)

        if (lst1508.length > 0) {
          tt1508 = Number(lst1508.map(x => x.TT_1508).reduce((a, b) => a + b))
        }
        let lstTienPs = lstDataByDvi.map(x => x.tienPs)
        let lstTienPk = lstDataByDvi.map(x => x.tienPk);
        let tienPs = lstTienPs.length > 0 ? lstTienPs.reduce((a, b) => a + b) : 0;
        let tienPK = lstTienPk.length > 0 ? lstTienPk.reduce((a, b) => a + b) : 0;
        let lstTp = lstDataByDvi.map(x => x.dienTp);
        let tp = lstTp.length > 0 ? lstTp.reduce((a, b) => a + b) : 0;
        let tableObject = {
          tenDvi: element.TEN_DVIQLY,
          thuongPham: Number(Math.round(tp / 1000000)),
          giaBquan: lstGiaBq.length > 0 ? Number(lstGiaBq[0].BQUAN) : 0,
          doanhThu: Number(((tienPs + tienPK) / 1000000000).toFixed(3)),
          tt385: tt385,
          tt1508: tt1508
        }
        this.lstDataTable.push(tableObject);
      });
    } catch (error) {
      this.isLoading = false
    } finally {
      this.isLoading = false
    }

  }

  async updateChartTP() {
    // Biểu đồ thương phẩm
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
        text:
          `
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 22px;
        line-height: 28px;
        color: #CE7A58;">${this.stringFormat(Math.round((this.tongDienTP / 1000000)))} triệu</p>
        `
        ,
        align: 'center',
        verticalAlign: 'middle',
        y: 80,
        x: -21
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
              return ` <span style="font-size:10px!important">${this.key} <br> ${temp}%</span><br/>`
            },
            style: {
              color: '#515151',
              fontsize: '12px',
              width: '100px'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['45%', '110%'],
          size: '200%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Tỷ lệ',
        innerSize: '50%',
        data: this.dataTP,
      }]
    };


  }
  async updateChartDT() {
    // Biểu đồ thương phẩm
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionsDThu = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },

      title: {
        useHTML: true,
        text:
          `
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 22px;
        line-height: 28px;
        color: #CE7A58;">${this.stringFormat(Number((this.tongDThu / 1000000000).toFixed(3)))} tỷ</p>
        `
        ,
        align: 'center',
        verticalAlign: 'middle',
        y: 80,
        x: -15
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
              return ` <span style="font-size:10px!important">${this.key} <br> ${temp}%</span><br/>`
            },
            style: {
              color: '#515151',
              fontsize: '12px',
              width: '100px'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['48%', '110%'],
          size: '200%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Tỷ lệ',
        innerSize: '50%',
        data: this.dataDThu,
      }]
    };


  }
  async updateChartHDMBD() {
    // Biểu đồ số hợp đồng mua bán điện
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Montserrat',
        }
      },
      colors: this.charColor
    });

    this.chartOptionsHDMBD = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },

      title: {
        useHTML: true,
        text:
          `
        <p style="font-family: 'Oswald';
        font-style: normal;
        font-weight: 600;
        font-size: 22px;
        line-height: 28px;
        color: #CE7A58;">${this.stringFormat(Number((this.tongSoHDMBD / 1000000).toFixed(3)))} triệu</p>
        `
        ,
        align: 'center',
        verticalAlign: 'middle',
        y: 80,
        x: -16
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
              return ` <span style="font-size:10px!important">${this.key} <br> ${temp}%</span><br/>`
            },
            style: {
              color: '#515151',
              fontsize: '12px',
              width: '100px'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['45%', '110%'],
          size: '200%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Tỷ lệ',
        innerSize: '50%',
        data: this.dataHDMBD,
      }]
    };


  }




}
