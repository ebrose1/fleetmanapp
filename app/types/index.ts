export interface Vehicle {
  id: string;
  fleetNumber: string;
  make?: string;
  model?: string;
  year?: number;
}

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export type InspectionType = 'pre-trip' | 'post-trip';

export interface InspectionData {
  vehicleId: string;
  fleetNumber: string;
  employeeNumber: string;
  driverName: string;
  inspectionType: InspectionType;
  inspectionDate: string;
  odometer: number;
  
  // Pre-trip booleans
  bodyNewDamage?: boolean;
  bodyReverseSensors?: boolean;
  cabWindowsOk?: boolean;
  cabWindshieldOk?: boolean;
  cabWipersOk?: boolean;
  cameraReverseTurn?: boolean;
  cameraVedrFunctional?: boolean;
  engineAirBoxOk?: boolean;
  engineBatteryOk?: boolean;
  engineHornOk?: boolean;
  engineHosesOk?: boolean;
  fluidsCoolantOk?: boolean;
  fluidsBrakeFluidOk?: boolean;
  fluidsEngineOilOk?: boolean;
  fluidsPowerSteeringOk?: boolean;
  fluidsRadiatorOk?: boolean;
  fluidsNoLeaks?: boolean;
  fluidsWiperFluidOk?: boolean;
  fluidsTransmissionOk?: boolean | null;
  lightsBrakeOk?: boolean;
  lightsCargoOk?: boolean;
  lightsDashOk?: boolean;
  lightsDomeOk?: boolean;
  lightsHazardOk?: boolean;
  lightsHeadOk?: boolean;
  lightsLicensePlateOk?: boolean;
  lightsMarkerOk?: boolean;
  lightsReverseOk?: boolean;
  lightsTailOk?: boolean;
  lightsTurnSignalsOk?: boolean;
  tiresLugNutsOk?: boolean;
  tiresRimsOk?: boolean;
  tiresSpareOk?: boolean | null;
  toolsAccidentPacket?: boolean;
  toolsBoosterCables?: boolean;
  toolsFireExtinguisher?: boolean;
  toolsPackageDolly?: boolean;
  toolsHandsheets?: boolean;
  toolsJack?: boolean | null;
  toolsTowStraps?: boolean | null;
  toolsTriangles?: boolean;
  toolsVehicleFolder?: boolean;
  
  // Tire measurements
  tiresPsiLf?: number;
  tiresPsiLr?: number;
  tiresPsiRf?: number;
  tiresPsiRr?: number;
  tiresTreadFl?: number;
  tiresTreadFr?: number;
  tiresTreadRl?: number;
  tiresTreadRr?: number;
  
  // Post-trip booleans
  brakesSoundFeel?: boolean;
  cabGaugesFunctional?: boolean;
  cabSeatBeltsOk?: boolean;
  cabShiftImmobilizer?: boolean;
  doorsHandlesOk?: boolean;
  doorsLocksOk?: boolean;
  doorsMirrorsOk?: boolean;
  proceduresClockOut?: boolean;
  proceduresCloseScanner?: boolean;
  proceduresHazmatCleared?: boolean;
  proceduresRemoveTrash?: boolean;
  reportableIncidents?: boolean;
  
  // Optional fields
  drivingConditions?: string;
  comments?: string;
  photoUrls?: string[];
}

export interface LocalInspection extends InspectionData {
  localId: string;
  synced: boolean;
  createdAt: number;
}