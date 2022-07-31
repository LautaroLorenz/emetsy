export interface Phases {
  phaseL1: {
    voltageU1: number;
    currentI1: number;
    anglePhi1: number;
  },
  phaseL2: {
    voltageU2: number;
    currentI2: number;
    anglePhi2: number;
  },
  phaseL3: {
    voltageU3: number;
    currentI3: number;
    anglePhi3: number;
  },
}
