import { SimulatorTag, SimulatorItem, SimulatorDocument } from "../proxies/data-simulator-api";
import { TagData } from "../services/dashboard-data.service";

export interface IDashboardControl {
  item: SimulatorItem;
  data: TagData | string;
  resize();
  getContentWidth();
}

export interface ITagControl extends IDashboardControl {
  item: SimulatorTag;
  data: TagData;
}

export interface IDocumentControl extends IDashboardControl {
  item: SimulatorDocument;
  data: string;
}