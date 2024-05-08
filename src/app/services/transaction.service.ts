import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Transaction} from "../dtos/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private BASE_PATH = 'http://localhost:8090/transaction';


  constructor(private http: HttpClient) { }

  createTransaction(transaction: Transaction): Observable<any[]> {
    if (transaction) {
      return this.http.post<any[]>(`${this.BASE_PATH}/create`, transaction);
    } else {
      throw Error('Transaction should not be null!')
    }
  }

  getBankTransactions(bankUuid: string | null | undefined): Observable<any[]> {
    if (bankUuid) {
      return this.http.get<any[]>(`${this.BASE_PATH}/bank/${bankUuid}`);
    } else {
      throw Error('v should not be null!')
    }
  }

  getImporterTransactions(importerUuid: string | null | undefined): Observable<any[]> {
    if (importerUuid) {
      return  this.http.get<any[]>(`${this.BASE_PATH}/importer/${importerUuid}`);
    } else {
      throw Error('importerUuid should not be null!')
    }
  }

  getExporterTransactions(exporterUuid: string | null | undefined): Observable<any[]> {
    if (exporterUuid) {
      return  this.http.get<any[]>(`${this.BASE_PATH}/exporter/${exporterUuid}`);
    } else {
      throw Error('exporterUuid should not be null!')
    }
  }

  updateTransaction(transaction: Transaction): Observable<any[]> {
    if (transaction) {
      return  this.http.put<any[]>(`${this.BASE_PATH}/update`, transaction);
    } else {
      throw Error('Transaction should not be null!')
    }
  }

  acceptBankTransaction(transaction: Transaction | null | undefined): Observable<any[]> {
    if (transaction) {
      return  this.http.put<any[]>(`${this.BASE_PATH}/accept-bank`, transaction);
    } else {
      throw Error('Transaction should not be null!')
    }
  }

  declineBankTransaction(uuid: string | null | undefined): Observable<any[]> {
    if (uuid) {
      return  this.http.put<any[]>(`${this.BASE_PATH}/declined-bank/${uuid}`, null);
    } else {
      throw Error('uuid should not be null!')
    }
  }

  acceptExporterTransaction(transaction: Transaction | null | undefined): Observable<any[]> {
    if (transaction) {
      return  this.http.put<any[]>(`${this.BASE_PATH}/accept-exporter`, transaction);
    } else {
      throw Error('Transaction should not be null!')
    }
  }

  declineExporterTransaction(uuid: string | null | undefined): Observable<any[]> {
    if (uuid) {
      return  this.http.put<any[]>(`${this.BASE_PATH}/declined-exporter/${uuid}`, null);
    } else {
      throw Error('uuid should not be null!')
    }
  }

  static compareTransactionDates(a: Transaction, b: Transaction) {
    if (!a  || !a.createdDate) {
      return -1;
    }
    if (!b || !b.createdDate) {
      return 1;
    }
    if(a.createdDate > b.createdDate) return -1;
    return 1;
  }
}
