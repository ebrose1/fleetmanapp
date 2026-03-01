export const validateFleetNumber = (fleetNumber: string): boolean => {
  // Must be 6 digits
  return /^\d{6}$/.test(fleetNumber);
};

export const validateEmployeeNumber = (employeeNumber: string): boolean => {
  // Must not be empty - adjust pattern if you have specific format
  return employeeNumber.trim().length > 0;
};

export const validateOdometer = (value: number, lastReading: number | null): {
  isValid: boolean;
  error?: string;
} => {
  if (isNaN(value) || value < 0) {
    return { isValid: false, error: 'Odometer must be a positive number' };
  }
  
  if (lastReading !== null && value < lastReading) {
    return {
      isValid: false,
      error: `Odometer cannot be less than last reading (${lastReading})`,
    };
  }
  
  return { isValid: true };
};

export const validateTirePressure = (psi: number | undefined): {
  isValid: boolean;
  warning?: string;
} => {
  if (psi === undefined || psi === null) {
    return { isValid: true };
  }
  
  if (psi < 50) {
    return {
      isValid: true,
      warning: `Low pressure: ${psi} PSI (should be ≥50)`,
    };
  }
  
  return { isValid: true };
};

export const validateTreadDepth = (depth: number | undefined): {
  isValid: boolean;
  warning?: string;
} => {
  if (depth === undefined || depth === null) {
    return { isValid: true };
  }
  
  if (depth < 5) {
    return {
      isValid: true,
      warning: `Low tread: ${depth}/32" (should be ≥5/32")`,
    };
  }
  
  return { isValid: true };
};