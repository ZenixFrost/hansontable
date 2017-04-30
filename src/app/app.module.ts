import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TableComponent } from './component/table/table.component';
import { DataService} from "./services/data.service";
import { BudgetTableComponent } from './component/budget-table/budget-table.component';
import { Routes, RouterModule} from "@angular/router";

const appRoutes: Routes = [
  { path: 'table', component: TableComponent },
  { path: 'budget', component: BudgetTableComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    BudgetTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
