import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Bank} from "../dtos/bank";
import {RoleEnum} from "../enums/enums";
import {BankService} from "../services/bank.service";
import {Transaction} from "../dtos/transaction";
import {TransactionService} from "../services/transaction.service";
import {WebSocketService} from "../services/web-socket.service";
import {TransactionFormComponent} from "../shared/transaction-form/transaction-form.component";

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
    @ViewChild('transactionFormComponent') transactionFormComponent: TransactionFormComponent | undefined;


    @Output() acceptClick: EventEmitter<any> = new EventEmitter();

  banks: Bank[] | undefined;
  selectedBank: Bank | undefined;
  selectedTransaction: Transaction | undefined = {};
  transactions: Transaction[] = [];
  errorMessage: string | null = null;
  BANK_PAGE = RoleEnum.BANK;
  TRANSACTION_SUCCESSFULLY_ACCEPTED_BANK_MESSAGE = 'Transaction sucesfully accepted by the bank!';
  PLESE_SELECT_TRANSACTION_MESSAGE = 'Please select a transaction!';

  constructor(
      private banckService: BankService,
      private transactionService: TransactionService,
      private webSocketService: WebSocketService,
  ) {
    this.loadBanks();
  }

  ngOnInit(): void {
      this.webSocketService.connect(RoleEnum.BANK);
      this.webSocketService.getTransactionUpdates().subscribe(transaction => {
          this.updateTransactionsList(transaction);
      });
  }

  updateTransactionsList(transaction: Transaction) {
      if (transaction?.bank?.uuid === this.selectedBank?.uuid) {
          const index = this.transactions.findIndex(transactionItem => transactionItem.uuid === transaction.uuid);
          if (index !== -1) {
              this.transactions[index] = transaction;
          } else {
              this.transactions.push(transaction);
              this.transactions.sort((a, b) => TransactionService.compareTransactionDates(a, b));
          }
      }
  }

  loadBanks() {
    this.banckService.getBanks()
        .subscribe(
            response => {
              this.banks = response;
              this.selectedBank = this.banks.length > 0 ? this.banks[0] : undefined;
              this.loadTransactions();
            },
            error => {
              throw error;
            }
        );
  }

  bankChanged() {
      this.transactionFormComponent?.updateFormFieldsBank(this.selectedBank);
      this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getBankTransactions(this.selectedBank?.uuid).subscribe(
        response => {
          this.transactions = response;
        },
        error => {
          throw error;
        }
    );
  }

  selectTransaction(transaction: Transaction) {
      this.selectedTransaction = transaction;
  }


    onBankModifiedStatus(transaction: Transaction) {
        if (transaction?.bank?.uuid === this.selectedBank?.uuid) {
            this.transactions = this.transactions.filter(transactionItem => transactionItem.uuid !== transaction.uuid);
        }
    }

}
