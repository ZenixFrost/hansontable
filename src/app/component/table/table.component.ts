import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
declare var Handsontable: any;
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  container: any;
  hot: any;
  dataList:any;
  summary:any[] = [];
  merge:any[] = [];

  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.dataService.getData().subscribe((res) => {
      this.dataList = res;
      this.getSummaly();
      this.getMerge();
      this.getTable();
    });
  }

  getTable(){
    this.container = document.getElementById('example');
    this.hot = new Handsontable(this.container, {
      data: this.dataList,
      colHeaders: (col) => {
        let txt = null;
        if(col == 0){
          txt = "จังหวัด";
        }else if(col == 1){
          txt = "รายการ";
        }else if(col == 2){
          txt = "ประเภทเงิน";
        }else if(col == 3){
          txt = "เงินกู้ในประเทศ (" + this.getSum(7) + ")";
        }else if(col == 4){
          txt = "เงินกู้ต่างประเทศ (" + this.getSum(8) + ")";
        }else if(col == 5){
          txt = "นวัตกรรมทางการเงิน (" + this.getSum(9)+ ")";
        }
        return txt;
      },
      rowHeaders: true,
      columns: [
        {
          data: 'province',
          type: 'text',
        },{
          data: 'list.id',
          type: 'text',
          renderer:  (instance, td, row, col, prop, value, cellProperties) => {
            let name = null;

            if(this.hot != null && value != null){
              name = this.hot.getDataAtRowProp(row, 'list.name');
              td.innerHTML = value+" - "+name;
              return td;
            }else{
              return "";
            }
          },
          editor: false
        },{
          data: 'type_money',
          type: 'text',
        },{
          data: 'nbud7',
          type: 'numeric',
          format: '0.00',
        },{
          data: 'nbud8',
          type: 'numeric',
          format: '0.00',

        },{
          data: 'nbud9',
          type: 'numeric',
          format: '0.00',
        }
      ],
      // nestedHeaders: [
      //   [
      //    'จังหวัด', {label: 'รายการ', colspan: 2},'ประเภทเงิน',"เงินกู้ในประเทศ","เงินกู้ต่างประเทศ","นวัตกรรมทางการเงิน"
      //   ]
      // ],
      mergeCells: this.merge,
      columnSummary: this.summary
    });
  }

  coverRenderer (instance, td, row, col, prop, value, cellProperties) {
    td.innerHTML = value;
    return td;
  }

  getSum(nbud){
    let sum = 0;
    for (let i = 0; i < this.dataList.length; i++) {
      if(nbud == 7){
        sum += this.dataList[i].nbud7;
      }else if(nbud == 8){
        sum += this.dataList[i].nbud8;
      }else if(nbud == 9){
        sum += this.dataList[i].nbud9;
      }
    }
    return sum
  }

  getSummaly(){
    let range = {
      start: null,
      end: null
    };
    let check = true;
    let id = null;

    for (let i = 0; i < this.dataList.length; i++) {
      if(check){
        range.start = i;
        check = false;
      }
      if(i == 0){
        id = this.dataList[i].list.id;
      }else{
        if(id != this.dataList[i].list.id){
          check = true;
          range.end = i-1;
          id = this.dataList[i].list.id;
          this.dataList.splice(i, 0, {});

          for (let j = 3; j <= 5; j++) {
            this.summary = [...this.summary,{
              ranges: [
                [range.start, range.end],
              ],
              destinationRow: i,
              destinationColumn: j,
              type: 'sum',
            }];
          }
        }
      }
    }

    this.dataList.splice(this.dataList.length, 0, {});
    for (let j = 3; j <= 5; j++) {
      this.summary = [...this.summary, {
        ranges: [
          [range.start, this.dataList.length - 2],
        ],
        destinationRow: this.dataList.length - 1,
        destinationColumn: j,
        type: 'sum',
      }];
    }
  }

  getMerge(){
    let range = {
      start: null,
      end: null
    };
    let listRange = {
      start: null,
      end: null
    };
    let check = true;
    let ListCheck = true;

    let province = null;
    let id = null;

    for (let i = 0; i < this.dataList.length; i++) {
      if(i == 0){
        province = this.dataList[i].province;
        id = this.dataList[i].list.id;
      }else{
        if(this.dataList[i].province != null && province != this.dataList[i].province){
          range.end = i;
          province = this.dataList[i].province;
          check = true;
          this.merge = [...this.merge,{row: range.start, col: 0, rowspan: this.dataList.length - range.end, colspan: 1}];
        }

        if(i< this.dataList.length-1 && this.dataList[i].list == null){
          listRange.end = i-1;
          id = this.dataList[i+1].list.id;
          ListCheck = true;
          this.merge = [...this.merge,{row: listRange.start, col: 1, rowspan: 3, colspan: 1}];
        }
      }

      if(check){
        range.start = i;
        check = false;
      }

      if(ListCheck){
        if(i == 0){
          listRange.start = i;
        }else{
          listRange.start = i+1;
        }
        ListCheck = false;
      }
    }
    console.log(listRange);
    this.merge = [...this.merge,{row: listRange.start, col: 1, rowspan: 3, colspan: 1}];
    this.merge = [...this.merge,{row: range.start, col: 0, rowspan: this.dataList.length - range.end, colspan: 1}];

  }

}
