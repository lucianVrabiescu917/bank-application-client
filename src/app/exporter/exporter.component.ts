import {Component, ViewChild} from '@angular/core';
import {Exporter} from "../dtos/exporter";
import {Transaction} from "../dtos/transaction";
import {RoleEnum} from "../enums/enums";
import {TransactionService} from "../services/transaction.service";
import {WebSocketService} from "../services/web-socket.service";
import {ExporterService} from "../services/exporter.service";
import {TransactionFormComponent} from "../shared/transaction-form/transaction-form.component";

@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss']
})
export class ExporterComponent {
  @ViewChild('transactionFormComponent') transactionFormComponent: TransactionFormComponent | undefined;

  exporters: Exporter[] | undefined;
  selectedExporter: Exporter | undefined;
  selectedTransaction: Transaction | undefined = {};
  transactions: Transaction[] = [];
  errorMessage: string | null = null;
  EXPORTER_PAGE = RoleEnum.EXPORTER;

  TRANSACTION_SUCCESSFULLY_ACCEPTED_EXPORTER_MESSAGE = 'Transaction sucesfully accepted by the exporter!';
  PLESE_SELECT_TRANSACTION_MESSAGE = 'Please select a transaction!';

  constructor(
      private exporterService: ExporterService,
      private transactionService: TransactionService,
      private webSocketService: WebSocketService,
  ) {
    this.loadExporters();
  }

  ngOnInit(): void {
    this.webSocketService.connect(RoleEnum.EXPORTER);
    this.webSocketService.getTransactionUpdates().subscribe(transaction => {
      this.updateTransactionsList(transaction);
    });
  }

  loadExporters() {
    this.exporterService.getExporters().subscribe(
        response => {
          this.exporters = response;
          this.selectedExporter = this.exporters.length > 0 ? this.exporters[0] : undefined;
          this.loadTransactions();
        },
        error => {
          throw error;
        }
    )
  }

  exporterChanged() {
    this.transactionFormComponent?.updateFormFieldsExporter(this.selectedExporter);
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getExporterTransactions(this.selectedExporter?.uuid).subscribe(
        response => {
          this.transactions = response;
        },
        error => {
          throw error;
        }
    );
  }

  updateTransactionsList(transaction: Transaction) {
    if (transaction?.exporter?.uuid === this.selectedExporter?.uuid) {
      const index = this.transactions.findIndex(transactionItem => transactionItem.uuid === transaction.uuid);
      if (index !== -1) {
        this.transactions[index] = transaction;
      } else {
        this.transactions.push(transaction);
        this.transactions.sort((a, b) => TransactionService.compareTransactionDates(a, b));
      }
    }
  }

  onExporterResponse(transaction: Transaction) {
    if (transaction?.exporter?.uuid === this.selectedExporter?.uuid) {
      this.transactions = this.transactions.filter(transactionItem => transactionItem.uuid !== transaction.uuid);
    }
  }

  selectTransaction(transaction: Transaction) {
    this.selectedTransaction = transaction;
  }

}
