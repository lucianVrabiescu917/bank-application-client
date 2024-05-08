import {Bank} from "./bank";
import {Exporter} from "./exporter";
import {Importer} from "./importer";
import {UnitEnum, Status} from "../enums/enums";

export class Transaction {
	uuid?: string | undefined;
	createdDate?: Date | undefined;
	importer?: Importer | undefined;
	bank?: Bank | undefined;
	exporter?: Exporter | undefined;
	status?: string | undefined;
	bankAccountNumber?: number | undefined;
	goodsType?: string | undefined;
	unit?: UnitEnum | undefined;
	address?: string | undefined;
	phone?: string | undefined;
	email?: string | undefined;
	comment?: string | undefined;
	netPrice?: number | undefined;
	exporterComment?: string | undefined;
	deliveryDate?: Date | undefined;
}
