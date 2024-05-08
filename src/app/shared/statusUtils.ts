import {Status} from "../enums/enums";

export class StatusUtils {
	static isStatusForImporter(status: Status): boolean {
		return StatusUtils.IMPORTER_STATUSES.includes(status);
	}

	static isStatusForBank(status: Status): boolean {
		return StatusUtils.BANK_STATUSES.includes(status);
	}

	static isStatusForExporter(status: Status): boolean {
		return StatusUtils.EXPORTER_STATUSES.includes(status);
	}

	static readonly EXPORTER_STATUSES: Status[] = [Status.ACCEPTED_BANK];

	static readonly BANK_STATUSES: Status[] = [
		Status.PENDING,
		Status.DECLINED,
		Status.ACCEPTED
	];

	static readonly IMPORTER_STATUSES: Status[] = [
		Status.ACCEPTED,
		Status.DECLINED_BANK
	];

}
