import { SimulatorTag, SimulatorItem, SimulatorDocument } from "../proxies/data-simulator-api";
import { TagData } from "../services/dashboard-data.service";

export interface IDashboardControl {
  tag: SimulatorItem;
  data: TagData | string;
  resize();
  getContentWidth();
}

export interface ITagControl extends IDashboardControl {
  tag: SimulatorTag;
  data: TagData;
}

export interface IDocumentControl extends IDashboardControl {
  tag: SimulatorDocument;
  data: string;
}