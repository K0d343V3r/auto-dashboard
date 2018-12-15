import { ItemId } from "../proxies/data-simulator-api";
import { RequestType, TimePeriod } from '../proxies/dashboard-api';

export class RequestTimeFrame {
  constructor(public targetTime: Date = null, public timePeriod: TimePeriod = null) {}
}

export interface IReversibleChanges {
  title: string;
  addItem(itemId: ItemId): void;
  removeItem(itemId: ItemId): void;
  toggleItemImportance(itemId: ItemId): void;
  changeRequestType(requestType: RequestType, timeFrame: RequestTimeFrame): void;
}
