import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Transaction} from "../dtos/transaction";
import { Stomp } from '@stomp/stompjs';
import {Frame} from "stompjs";
import {RoleEnum} from "../enums/enums";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  title = 'WebSocketClient';

  private transactionSubject = new Subject<Transaction>();

  private webSocket: WebSocket | undefined;

  constructor() {}

  connect(role: RoleEnum) {
    this.webSocket = new WebSocket(`ws://localhost:8090/transactions?role=${role.valueOf()}`);
    this.webSocket.onmessage = (event) => {
      let transaction = JSON.parse(event.data)
      this.transactionSubject.next(transaction);
    };
  }

  getTransactionUpdates(): Subject<Transaction> {
    return this.transactionSubject;
  }

}
