import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImporterService {

  private BASE_PATH = 'http://localhost:8090/importer';


  constructor(private http: HttpClient) { }

  getImporters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_PATH}/importers`);
  }
}
