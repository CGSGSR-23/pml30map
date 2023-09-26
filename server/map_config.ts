import { Vec2 } from "../src/system/linmath";

export interface FloorInfo {
  floorIndex: number,
  fileName: string
}

export interface MinimapInfo {
  name: string,

  floorCount: number,
  firstFloor: number,
  defFloor: number,

  imgStartPos: Vec2,
  imgEndPos: Vec2,
  modelStartPos: Vec2,
  modelEndPos: Vec2,

  floors: FloorInfo[],
}

export interface MapConfig {
  name: string;
  dbName: string;
  storageURL: string;
  minimapInfo: MinimapInfo;
}
