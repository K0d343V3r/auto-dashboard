import { TagId } from "../proxies/data-simulator-api";
import { RequestType, TimePeriod } from '../proxies/dashboard-api';

export class RequestTimeFrame {
  targetTime: Date;
  timePeriod: TimePeriod;
}

export interface IReversibleChanges {
  title: string;
  addTag(tagId: TagId);
  removeTag(tagId: TagId);
  toggleTagImportance(tagId: TagId);
  changeRequestType(requestType: RequestType, timeFrame: RequestTimeFrame);
}
