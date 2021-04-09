import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { CommonService } from '../common.service';
import { Utility } from '../utility';
import { MessageService } from 'primeng/api';

interface iKHTD {
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
  selector: 'app-sdung-dien-KHTD',
  templateUrl: './tinh-hinh-sdung-dien-KHTD.component.html',
  styleUrls: ['./tinh-hinh-sdung-dien-KHTD.component.css']
})
export class THinhSDDienKhTDComponent implements OnInit {

  dataTKD: any;
  optionTKD: any;

  highcharts = Highcharts;
  chartOptions: any;
  dKHTD: Date;
  date_has_value: Date;
  isLoading: boolean = false;
  dataLable: any = [];
  dataKhT: any = [];
  dataKhG: any = [];
  constructor(public service: CommonService, private utility: Utility, private messageService: MessageService) { }

  ngOnInit() {
    let today = new Date();
    if (today.getDate() >= 2) {
      this.dKHTD = new Date(today.getFullYear(), today.getMonth() - 1, 15);
    } else {
      this.dKHTD = new Date(today.getFullYear(), today.getMonth() - 2, 15);
    }
    this.date_has_value = this.dKHTD;
    this.getDataTKD_highCharts();
  }

  onSelectDate() {
    this.getDataTKD_highCharts();
  }

  async getDataTKD_highCharts() {
    this.isLoading = true;
    let res = await this.service.getDataAsync(this.utility.Get_KHTD(this.dKHTD.getFullYear(), this.dKHTD.getMonth() + 1));
    if (res && res.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Không có dữ liệu!",
        detail: `Tình hình sử dụng điện khách hàng cơ sở sử dụng năng lượng trọng điểm tháng ${this.dKHTD.getMonth() + 1} năm ${this.dKHTD.getFullYear()}`
      });
      this.dKHTD = this.date_has_value;
      this.isLoading = false;
      return;
    }
    this.date_has_value = this.dKHTD;
    // console.log("KHTD", res);
    this.xulyData(res);
    this.updateChart();
    this.isLoading = false;
  }

  xulyData(data: iKHTD[]) {
    this.dataLable = []; this.dataKhG = []; this.dataKhT = [];
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.dataLable.push(element.tenTinh);
      this.dataKhG.push(element.soKhSdG)
      this.dataKhT.push(element.soKhSdT)
    }
  }

  updateChart() {
    this.highcharts.setOptions({
      chart: {
        style: {
          fontFamily: 'Open Sans',
        }
      }
    });
    this.chartOptions = {
      // chart: {
      //   type: 'bar'
      // },
      title: {
        text: ""
        // useHTMl: true,
        // text: `<span style="font-family:'Montserrat'; color:#515151; font-weight: bold;text-transform:uppercase">
        // Tình hình sử dụng điện khách hàng cơ sở sử dụng năng lượng trọng điểm (>=500 TOE) tháng ${this.dKHTD.getMonth() + 1} năm ${this.dKHTD.getFullYear()}</span>`
      },
      legend: {
        squareSymbol: false,
        symbolWidth: 16,
        symbolHeight: 16,
        symbolRadius: 0
      },
      xAxis: {
        // categories: ['Lào Cai', 'Yên Bái', 'Điện Biên', 'Hòa Bình', 'Lai Châu', 'Sơn La', 'Hà Giang', 'Cao Bằng', 'Bắc Kạn', 'Lạng Sơn', 'Tuyên Quang', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang',
        //   'Quảng Ninh', 'Bắc Ninh', 'Hà Nam', 'Vĩnh Phúc', 'Hà Nội', 'Hải Dương', 'Hưng Yên', 'Hải Phòng', 'Nam Định', 'Thái Bình', 'Ninh Bình',
        //   'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Gia Lai',
        //   'Kon Tum', 'ĐăkLăk', 'Đăk Nông', 'Bình Phước', 'Bình Thuận', 'Lâm Đồng', 'Tây Ninh', 'Bình Dương', 'TP Hồ Chí Minh', 'Bà Rịa Vũng Tàu', 'Đồng Nai', 'Long An', 'Đồng Tháp',
        //   'Tiền Giang', 'Bến Tre', 'Vĩnh Long', 'Cần Thơ', 'An Giang', 'Kiên Giang', 'Trà Vinh', 'Sóc Trăng', 'Ninh Thuận', 'Bạc Liêu', 'Cà Mau', 'Hậu Giang'],
        categories: this.dataLable,
        title: {
          text: null
        },
        labels: {
          enabled: true,
          rotation: -90,
          style: {
            color: "black",
            textOverflow: "none",
            fontWeight: 'bold',
            fontSize: "12px"
          }
        }
      },
      yAxis: {
        min: 0, 
        title: {
          useHTMl: true,
          text: `<span style="font-weight:bold">(số khách hàng)</span>`
        },
        labels: {
          overflow: 'justify',
          format: `{value}`,
          style: {
            color: '#8C8C8C'
          },
          formatter: function () {
            let temp = this.value;
            temp = temp.toString().replace('.', ',');
            temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `<span style="font-weight:bold">${temp}</span>`
          }
        }
      },
      tooltip: {
        // valueSuffix: ' số khách hàng',
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
            align: 'top',
            // inside: true,
            // rotation: -90,
            color: '#8C8C8C',
            borderColor: '#8C8C8C',
            formatter: function () {
              let temp = this.y;
              temp = temp.toString().replace('.', ',');
              return temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }
            // x: -10
          },
          pointPadding: 0.1,
          groupPadding: 0
        }
      },

      credits: {
        enabled: false
      },
      series: [

        {
          name: 'Khách hàng giảm so với cùng kỳ',
          color: '#219653',
          type: 'column',
          data: this.dataKhG
          // data: [4, 6, 3, 0, 2, 8, 12, 4, 2, 20, 15, 6, 10, 19, 18, 15,
          //   10, 15, 184, 4, 3, 43, 2, 40, 39, 44, 43, 1, 1, 1, 2,
          //   78, 5, 1, 5, 2, 37, 2, 2, 10, 2, 15, 15, 8, 8, 45,
          //   71, 44, 36, 20, 15, 18, 1, 5, 35, 20, 44, 10, 15, 5, 6,
          //   7, 8,]
        },
        {
          name: 'Khách hàng tăng so với cùng kỳ',
          color: '#ED5050',
          type: 'column',
          data: this.dataKhT
          // data: [4, 6, 3, 0, 2, 8, 12, 4, 2, 20, 15, 6, 10, 19, 18, 15,
          //   10, 15, 278, 4, 3, 43, 2, 40, 39, 44, 43, 1, 1, 1, 2,
          //   78, 5, 1, 5, 2, 37, 2, 2, 10, 2, 15, 15, 8, 8, 45,
          //   71, 44, 36, 20, 15, 18, 1, 5, 35, 20, 44, 10, 15, 5, 6,
          //   7, 8,]
        }
      ]
    };
  }
}
