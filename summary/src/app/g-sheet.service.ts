import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {map, Observable} from "rxjs";
import {Overview, overviewAttributesMapping} from "./sheet-overview/sheet-overview.component";

@Injectable({
  providedIn: 'root'
})
export class GSheetService {
  private BASE_URL: string = `https://sheets.googleapis.com/v4/spreadsheets/`;
  private config = environment.overview;


// https://sheets.googleapis.com/v4/spreadsheets/1JiWU8nWqw0dnzHT0ZgZC0-_Qr-FbzlQFtMBFpvbaIfE/values/Ostatnie%20karmienie?key=AIzaSyD-Nkv-g1682kKdauukFPmOCNaQk0wP540
  constructor(private http: HttpClient) {}

  getSheetData(): Observable<Overview> {
    return this.http.get(
      this.BASE_URL + `${this.config.spreadsheetId}/values/${this.config.worksheetName}?key=${environment.googleSheetsApiKey}`,
    )
      .pipe(
        map((res: any) => {
          const obj: any = {};
          const values = res.values;
          const columns = values[0];
          values.slice(1).forEach((el: any) => {
            columns.forEach((col: any, idx: number) => {
              const foo = Object.entries(overviewAttributesMapping).find(([, v]) => v === col);
              if (foo) {
                // @ts-ignore
                const value = el[idx];
                if (value === 'TRUE' || value === 'FALSE') {
                  obj[foo[0]] = String(value).toLowerCase() === 'true';;
                } else {
                  obj[foo[0]] = value;
                }
              }
            });
          });
          return obj;
        })
      )
  }
}
