import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Transaction} from "../../dtos/transaction";
import {RoleEnum, Status, UnitEnum} from "../../enums/enums";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Importer} from "../../dtos/importer";
import {Bank} from "../../dtos/bank";
import {Exporter} from "../../dtos/exporter";
import {ImporterService} from "../../services/importer.service";
import {ExporterService} from "../../services/exporter.service";
import {BankService} from "../../services/bank.service";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent {

    @Input() transaction: Transaction | undefined;
    @Input() pageType: RoleEnum | undefined;
    @Input() importer: Importer | undefined;
    @Input() importerCanSubmit: boolean = false;

    @Output() bankModifiedStatus: EventEmitter<Transaction> = new EventEmitter<Transaction>();
    @Output() bankUpdatedStatus: EventEmitter<Transaction> = new EventEmitter<Transaction>();
    @Output() exporterResponse: EventEmitter<Transaction> = new EventEmitter<Transaction>();
    @Output() importerSubmit: EventEmitter<Transaction> = new EventEmitter<Transaction>();

    isImporterPage: boolean | undefined;
    isExporterPage: boolean | undefined;
    isBankPage: boolean | undefined;

    importers: Importer[] | undefined;
    banks: Bank[] = [];
    exporters: Exporter[] = [];

    FORM_ERROR_MESSAGE = 'Please fill in all required fields correctly.';
    TRANSACTION_SUCCESSFULLY_CREATED_MESSAGE = 'Transaction sucesfully sent to bank!';
    TRANSACTION_SUCCESSFULLY_UPDATED_MESSAGE = 'Transaction sucesfully updated!';
    TRANSACTION_SUCCESSFULLY_ACCEPTED_BANK_MESSAGE = 'Transaction sucesfully accepted by the bank!';
    TRANSACTION_SUCCESSFULLY_DECLINED_BANK_MESSAGE = 'Transaction sucesfully declined by the bank!';
    TRANSACTION_SUCCESSFULLY_ACCEPTED_EXPORTER_MESSAGE = 'Transaction sucesfully accepted by the exporter!';
    TRANSACTION_SUCCESSFULLY_DECLINED_EXPORTER_MESSAGE = 'Transaction sucesfully declined by the exporter!';
    PLESE_SELECT_TRANSACTION_MESSAGE = 'Please select a transaction!';
    ACCEPTED = Status.ACCEPTED;
    DECLINED_BANK = Status.DECLINED_BANK;
    PENDING = Status.PENDING;
    DECLINED = Status.DECLINED;

    transactionForm: FormGroup = this.formBuilder.group({});
    unitOptions = Object.values(UnitEnum);
    errorMessage: string  | null = null;

    constructor(private formBuilder: FormBuilder,
              private importerService: ImporterService,
              private exporterService: ExporterService,
              private bankService: BankService,
              private transactionService: TransactionService) {

    }

    ngOnInit(): void {
        this.buildForm();
        this.loadBanks();
        this.loadExporters();
    }

    buildForm(): void {
        this.isImporterPage = RoleEnum.IMPORTER == this.pageType;
        this.isExporterPage = RoleEnum.EXPORTER == this.pageType;
        this.isBankPage = RoleEnum.BANK == this.pageType;

        let importer = this.importer ? this.importer : this.transaction?.importer;

        this.transactionForm = this.formBuilder.group({
          'uuid': [{value: this.transaction?.uuid, disabled: true}, Validators.required],
          'importer': [{value: importer, disabled: true}, Validators.required],
          'bank': [{value: this.transaction?.bank, disabled: !this.isImporterPage}, Validators.required],
          'exporter': [{value: this.transaction?.exporter, disabled: !this.isImporterPage}, Validators.required],
          'status': [{value: this.transaction?.status as Status}],
          'bankAccountNumber': [{value: this.transaction?.bankAccountNumber, disabled: this.isExporterPage}, [Validators.required, Validators.pattern("^[0-9]*$")]],
          'typeOfGoods': [{value: this.transaction?.goodsType, disabled: !this.isImporterPage}, Validators.required],
          'unit': [{value: this.transaction?.unit, disabled: !this.isImporterPage}, Validators.required],
          'receivingAddress': [{value: this.transaction?.address, disabled: !this.isImporterPage}, Validators.required],
          'phone': [{value: this.transaction?.phone, disabled: !this.isImporterPage}, [Validators.required, Validators.pattern("^[0-9]*$")]],
          'email': [{value: this.transaction?.email, disabled: !this.isImporterPage}, [Validators.required, Validators.email]],
          'comments': [{value: this.transaction?.comment, disabled: !this.isImporterPage}, Validators.required],
          'importerName': [{value: importer?.name, disabled: true}, Validators.required],
          'exporterName': [{value: this.transaction?.exporter?.name, disabled: true}, Validators.required],
          'bankName': [{value: this.transaction?.bank?.name, disabled: true}, Validators.required],
          'netPrice': [{value: this.transaction?.netPrice, disabled: !this.isExporterPage}, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
          'exporterComment': [{value: this.transaction?.exporterComment, disabled: !this.isExporterPage}, Validators.required],
          'deliveryDate': [{value: this.formatDate(this.transaction?.deliveryDate), disabled: !this.isExporterPage}, [Validators.required, this.dateValidator()]]
        });
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes.importer && changes.importer.currentValue) {
            this.updateFormFields();
        } else if (changes.transaction && changes.transaction.currentValue) {
            this.buildForm();
        }
    }

    resetFormFieldsExclude(exclude: string[]): void {
        Object.keys(this.transactionForm.controls).forEach(key => {
            if (exclude.findIndex(q => q === key) === -1) {
                this.transactionForm.get(key)?.reset();
            }
        });
    }

    updateFormFieldsBank(bank?: Bank): void {
        if (bank) {
            this.transactionForm.reset();
            this.transactionForm.patchValue({
                'bank': bank,
                'bankName': bank?.name
            });
        }
    }

    updateFormFieldsExporter(exporter?: Exporter): void {
        if (exporter) {
            this.transactionForm.reset();
            this.transactionForm.patchValue({
                'exporter': exporter,
                'exporterName': exporter?.name
            });
        }
    }

    private updateFormFields(): void {
        if (this.importer) {
            this.transactionForm.patchValue({
                'importer': this.importer,
                'importerName': this.importer.name
            });
        }
    }

    loadBanks(): void {
      this.bankService.getBanks()
          .subscribe(
              response => {
                  this.banks = response;
              },
              error => {
                  throw error;
              }
          );
    }

    loadExporters(): void {
        this.exporterService.getExporters()
            .subscribe(
                response => {
                    this.exporters = response;
                },
                error => {
                    throw error;
                }
            );
    }

    createTransactionFromForm() {
        return {
            bank: this.transactionForm?.get('bank')?.value as Bank,
            exporter: this.transactionForm?.get('exporter')?.value as Exporter,
            importer: this.transactionForm?.get('importer')?.value as Importer,
            bankAccountNumber: this.transactionForm?.get('bankAccountNumber')?.value as number,
            status: this.transactionForm?.get('status')?.value ? this.transactionForm?.get('status')?.value.value : null,
            goodsType: this.transactionForm?.get('typeOfGoods')?.value as string,
            unit: this.transactionForm?.get('unit')?.value as UnitEnum,
            address: this.transactionForm?.get('receivingAddress')?.value as string,
            phone: this.transactionForm?.get('phone')?.value as string,
            email: this.transactionForm?.get('email')?.value as string,
            comment: this.transactionForm?.get('comments')?.value as string,
            uuid: this.transactionForm?.get('uuid')?.value as string,
            netPrice: parseFloat(this.transactionForm?.get('netPrice')?.value) as number,
            exporterComment: this.transactionForm?.get('exporterComment')?.value as string,
            deliveryDate: new Date(this.transactionForm?.get('deliveryDate')?.value) as Date,
        }
    }

    isFormInvalid() {
        if (this.errorMessage == this.FORM_ERROR_MESSAGE) {
            this.errorMessage = null;
        }
        const invalid = [];
        const controls = this.transactionForm?.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid.length > 0;
    }

    onSubmit() {
        if (this.isFormInvalid()) {
            this.errorMessage = this.FORM_ERROR_MESSAGE;
        } else {
            this.errorMessage = null;
            let transaction: Transaction = this.createTransactionFromForm();
            this.transactionService.createTransaction(transaction).subscribe(
                response => {
                    if (response) {
                        this.errorMessage = this.TRANSACTION_SUCCESSFULLY_CREATED_MESSAGE;
                        this.resetFormFieldsExclude(['importer', 'importerName']);
                        this.transaction = {};
                        this.importerSubmit.emit(transaction);
                    }
                },
                error => {
                    throw error;
                }
            );

        }
    }


    onAccept() {
        if (this.isFormInvalid()) {
            this.errorMessage = this.FORM_ERROR_MESSAGE;
        } else {
            this.errorMessage = null;
            let transaction: Transaction = this.createTransactionFromForm();
            this.errorMessage = null;
            this.transactionService.acceptBankTransaction(transaction).subscribe(
                response => {
                    if (response) {
                        this.errorMessage = this.TRANSACTION_SUCCESSFULLY_ACCEPTED_BANK_MESSAGE;
                        this.transactionForm.reset();
                        this.bankModifiedStatus.emit(response as Transaction)
                    }
                },
                error => {
                    throw error;
                }
            );
        }
    }

    onDecline() {
        let uuid = this.transactionForm?.get('uuid')?.value;
        if (uuid) {
            this.errorMessage = null;
            this.transactionService.declineBankTransaction(uuid).subscribe(
                response => {
                    if (response) {
                        this.errorMessage = this.TRANSACTION_SUCCESSFULLY_DECLINED_BANK_MESSAGE;
                        this.transactionForm.reset();
                        this.bankModifiedStatus.emit(response as Transaction)
                    }
                },
                error => {
                    throw error;
                }
            );
        } else {
            this.errorMessage = this.PLESE_SELECT_TRANSACTION_MESSAGE;
        }
    }

    onAcceptExporter() {
        if (this.isFormInvalid()) {
            this.errorMessage = this.FORM_ERROR_MESSAGE;
        } else {
            this.errorMessage = null;
            let transaction: Transaction = this.createTransactionFromForm();
            this.errorMessage = null;
            this.transactionService.acceptExporterTransaction(transaction).subscribe(
                response => {
                    if (response) {
                        this.errorMessage = this.TRANSACTION_SUCCESSFULLY_ACCEPTED_EXPORTER_MESSAGE;
                        this.transactionForm.reset();
                        this.exporterResponse.emit(response as Transaction)
                    }
                },
                error => {
                    throw error;
                }
            );
        }
    }

    onDeclineExporter() {
        let uuid = this.transactionForm?.get('uuid')?.value;
        if (uuid) {
            this.errorMessage = null;
            this.transactionService.declineExporterTransaction(uuid).subscribe(
                response => {
                    if (response) {
                        this.errorMessage = this.TRANSACTION_SUCCESSFULLY_DECLINED_EXPORTER_MESSAGE;
                        this.transactionForm.reset();
                        this.exporterResponse.emit(response as Transaction)
                    }
                },
                error => {
                    throw error;
                }
            );
        } else {
            this.errorMessage = this.PLESE_SELECT_TRANSACTION_MESSAGE;
        }
    }

    dateValidator() {
        return (control: { value: string }) => {
            const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!datePattern.test(control.value)) {
                return { invalidDateFormat: true };
            }
            const parts = control.value.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            const isValidDate = new Date(year, month - 1, day).getFullYear() === year &&
                new Date(year, month - 1, day).getMonth() === month - 1 &&
                new Date(year, month - 1, day).getDate() === day;
            return isValidDate ? null : { invalidDate: true };
        };
    }

    formatDate(date: Date | null | undefined): string {
        if (!date) return '';
        const day = new Date(date).getDate().toString().padStart(2, '0');
        const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
        const year = new Date(date).getFullYear();
        return `${day}/${month}/${year}`;
    }

}
