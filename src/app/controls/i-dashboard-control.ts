import { SimulatorTag } from "../proxies/data-simulator-api";
import { TagData } from "../services/dashboard-data.service";

export interface IDashboardControl {
  tag: SimulatorTag;
  data: TagData;
  resize();
}