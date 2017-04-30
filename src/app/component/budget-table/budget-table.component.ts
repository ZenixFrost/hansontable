import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
declare var Handsontable: any;

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css']
})
export class BudgetTableComponent implements OnInit {
  container: any;
  hot: any;
  budgetList: any[] = [];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.getBudgetData().subscribe((res) => {
      this.budgetList = res;
      this.getTable();
    });
  }

  getTable() {
    this.container = document.getElementById('example');
    this.hot = new Handsontable(this.container, {
      data: this.budgetList,
      colHeaders: ['name', 'unit', 'amount', 'cost', 'request', 'outRequest'],
      columns: [
        {
          data: 'name',
          type: 'text',
          renderer: (instance, td, row, col, prop, value, cellProperties) => {
            let layer = null;
            if (this.hot != null) {
              layer = this.hot.getDataAtRowProp(row, 'layer');
              if (layer == 1) {
                td.innerHTML = "<span style='font-weight: bold'>" + value + "</span>";
              } else if (layer == 2) {
                td.innerHTML = "<span style='font-weight: bold;margin-left: 15px'>" + value + "</span>";
              } else if (layer == 3) {
                td.innerHTML = "<span style='font-weight: bold;margin-left: 30px'>" + value + "</span>";
              } else if (layer == 4) {
                td.innerHTML = "<span style='margin-left: 45px'>" + value + "</span>";
              }
              return td
            }
          },
          editor: false
        }, {
          data: 'data.unit',
        }, {
          data: 'data.amount',
        }, {
          data: 'data.cost',
        }, {
          data: 'data.request',
        }, {
          data: 'data.outRequest',
          type: 'numeric',
        }
      ],
      rowHeaders: true,
      columnSummary: () => {
        let summary: any[] = [];
        let row = 0;
        let range = {
          layer1: [],
          layer2: [],
          layer3: [],
        };

        let check = false;
        for (let i = 0; i < this.budgetList.length; i++) {
          if (this.budgetList[i].layer == 1) {
            check = !check;
          }

          if (check) {
            if (this.budgetList[i].data.length != 0) {
              range.layer1 = [...range.layer1, [i]];
            }
          } else {
            summary = [...summary,
              {
                ranges: range.layer1,
                destinationRow: row,
                destinationColumn: 5,
                type: 'sum',
              }
            ];
            row = i;
            range.layer1 = [];
            check = !check;
          }
        }
        console.log(row);
        return summary;
      }
    });
    this.hot.render();
  }
}
