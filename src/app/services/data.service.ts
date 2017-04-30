import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";

@Injectable()
export class DataService {

  constructor(private http:Http) { }

  getData(){
    return this.http.get('./src/app/data/data.json').map((res:Response) => res.json().data);
  }

  getBudgetData(){
    return this.http.get('./src/app/data/budgetINs.json').map((res:Response) => res.json().node);
  }

}
