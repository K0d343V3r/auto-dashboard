import { TagId } from "../proxies/data-simulator-api";
import { RequestType, TimePeriod } from '../proxies/dashboard-api';

export class RequestTimeFrame {
  constructor(public targetTime: Date = null, public timePeriod: TimePeriod = null) {}
}

export interface IReversibleChanges {
  title: string;
  addTag(tagId: TagId);
  removeTag(tagId: TagId);
  toggleTagImportance(tagId: TagId);
  changeRequestType(requestType: RequestType, timeFrame: RequestTimeFrame);
}
