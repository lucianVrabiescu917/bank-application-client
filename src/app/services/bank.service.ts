import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private BASE_PATH = 'http://localhost:8090/bank';


  constructor(private http: HttpClient) { }

  getBanks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_PATH}/banks`);
  }
}
