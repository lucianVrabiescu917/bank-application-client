import {Component, OnInit, ViewChild} from '@angular/core';
import {Importer} from "../dtos/importer";
import {ImporterService} from "../services/importer.service";
import {Bank} from "../dtos/bank";
import {Exporter} from "../dtos/exporter";
import {RoleEnum} from "../enums/enums";
import {WebSocketService} from "../services/web-socket.service";
import {Transaction} from "../dtos/transaction";
import {TransactionService} from "../services/transaction.service";
import {TransactionFormComponent} from "../shared/transaction-form/transaction-form.component";

@Component({
  selector: 'app-importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.scss']
})
export class ImporterComponent implements OnInit {
  @ViewChild('transactionFormComponent') transactionFormComponent: TransactionFormComponent | undefined;
  importers: Importer[] | undefined;
  selectedImporter: Importer | undefined;
  selectedTransaction: Transaction | undefined;
  importerCanSubmit: boolean = false;

  banks: Bank[] = [];
  exporters: Exporter[] = [];
  transactions: Transaction[] = [];
  errorMessage: string | null = null;
  IMPORTER_PAGE = RoleEnum.IMPORTER;


  constructor(
      private importerService: ImporterService,
      private webSocketService: WebSocketService,
      private transactionService: TransactionService,
  ) {
    this.loadImporters();
  }

  ngOnInit(): void {
    this.webSocketService.connect(RoleEnum.IMPORTER);
      this.webSocketService.getTransactionUpdates().subscribe(transaction => {
          if (transaction?.importer?.uuid === this.selectedImporter?.uuid) {
              const index = this.transactions.findIndex(transactionItem => transactionItem.uuid === transaction.uuid);
              if (index !== -1) {
                  this.transactions[index] = transaction;
              } else {
                  this.transactions.push(transaction);
                  this.transactions.sort((a, b) => TransactionService.compareTransactionDates(a, b));
              }
          }
      });
  }

  loadImporters() {
    this.importerService.getImporters()
        .subscribe(
            response => {
              this.importers = response;
              this.selectedImporter = this.importers.length > 0 ? this.importers[0] : undefined;
              this.selectedTransaction = {importer: this.selectedImporter};
              this.loadTransactions();
            },
            error => {
              throw error;
            }
        );
  }

  loadTransactions() {
    this.transactionService.getImporterTransactions(this.selectedImporter?.uuid).subscribe(
        response => {
          this.transactions = response;
        },
        error => {
          throw error;
        }
    );
  }

  importerChanged() {
      this.transactionFormComponent?.resetFormFieldsExclude(['importer', 'importerName']);
      this.loadTransactions();
  }

  onImporterSelect(importer: Importer): void {
    this.selectedImporter = importer;
  }

  onImporterSubmit(transaction: Transaction) {
      if (transaction?.importer?.uuid === this.selectedImporter?.uuid) {
          this.transactions = this.transactions.filter(transactionItem => transactionItem.uuid !== transaction.uuid);
      }
  }

    selectTransaction(transaction: Transaction) {
        this.selectedTransaction = transaction
        this.importerCanSubmit = true;

    }
}
