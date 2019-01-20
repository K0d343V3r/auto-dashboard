import { ItemId } from "../proxies/data-simulator-api";
import { RequestType, TimePeriod } from '../proxies/dashboard-api';
import { RefreshScale } from "./active-dashboard/dashboard-display-settings";

export class RequestTimeFrame {
  constructor(public targetTime: Date = null, public timePeriod: TimePeriod = null) {}
}

export interface IReversibleChanges {
  addItem(itemId: ItemId): void;
  removeItem(itemId: ItemId): void;
  toggleItemImportance(itemId: ItemId): void;
  setRequestType(requestType: RequestType, timeFrame: RequestTimeFrame): void;
  title: string;
  setRefreshRate(refreshRate: number, refreshScale: RefreshScale): void;
}
