export interface Box {
  x: number;
  y: number;
  size: number;
}

export interface IBoxable {
  getBox(): Box
}
