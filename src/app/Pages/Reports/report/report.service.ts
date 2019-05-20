import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  data = new Subject<Object>();
  reports: any = [];
  total: number = 0;
  summary: any = [];
  positive: any = [];
  negative: any = [];
  noContact: any = [];
  isFetching = false;
  token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidGFyZ2V0X2RldGFpbF9pZCI6MSwidXNlcm5hbWUiOiJqYW5lc09TIiwiY3JlYXRlZF9hdCI6IjIwMTgtMDEtMThUMTI6MjM6MTUuMDAwWiIsImlhdCI6MTU1ODMzNDY0MywiZXhwIjoxNTU4NDIxMDQzfQ.AFZcbicq-A_0jYqbg4ry5Wufqq0pOmjQ7kzAUaZ9tsE";
  constructor(private http: HttpClient, private loadingctrl: LoadingController) { }

  getData() {
    this.http.get(
      'http://localhost:5000/api/reports', { headers: { Authorization: this.token}
    }).subscribe(res => {
      this.reports = res;
      this.data.next(res);
    });
  }
  getFilteredData(start, end) {
    this.http.get(
      `http://localhost:5000/api/reports?start=${start}&end=${end}`, { headers: { Authorization: this.token}
    }).subscribe(res => {
      this.reports = res;
      this.calculate();
      this.data.next(res);
      this.isFetching = false;
    });
    this.isFetching = true;
    this.loadingctrl.create({
      keyboardClose: true,
     message: "Generating Data..",
   })
   .then(loadingEl=>{
     loadingEl.present().then(()=>{
       if(!this.isFetching){
         loadingEl.dismiss();
       }
     });
   });
  }
  calculate() {
// tslint:disable-next-line: forin
    this.positive = [];
    this.negative = [];
    this.noContact = [];
    for (let row in this.reports) {
        // this.total += (this.reports[row]["cnt"]);
      var element = this.reports[row];
      if (element.type == "positive") {
        this.positive = [...this.positive, element];
        // this.positive.push(element);
      }
      if (element.type == "no contact") {
        this.noContact = [...this.noContact, element];
        // this.noContact.push(element);
      }
      if (element.type == "negative") {
        this.negative = [...this.negative, element];
        // this.negative.push(element);
      }
      this.total = element.total_rec;
    }
    // console.log(this.positive);
    // console.log(this.negative);
    // console.log(this.noContact);
  }
}