import { SimulatorTag, VQT } from "../../proxies/data-simulator-api";

export interface IDashboardControl {
  tag: SimulatorTag;
  values: VQT[];
  resize();
}