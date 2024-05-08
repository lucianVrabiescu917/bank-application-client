import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExporterService {
  private BASE_PATH = 'http://localhost:8090/exporter';


  constructor(private http: HttpClient) { }

  getExporters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_PATH}/exporters`);
  }
}
