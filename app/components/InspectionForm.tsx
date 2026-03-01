import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { InspectionData, InspectionType } from '../types';

interface InspectionFormProps {
  inspectionType: InspectionType;
  data: Partial<InspectionData>;
  onChange: (field: keyof InspectionData, value: any) => void;
}

type RadioOption = 'yes' | 'no' | 'na';

const RadioButton: React.FC<{
  label: string;
  value: boolean | null | undefined;
  onChange: (value: boolean | null) => void;
  showNA?: boolean;
}> = ({ label, value, onChange, showNA = false }) => {
  const getValue = (): RadioOption => {
    if (value === true) return 'yes';
    if (value === false) return 'no';
    return 'na';
  };

  const handlePress = (option: RadioOption) => {
    if (option === 'yes') onChange(true);
    else if (option === 'no') onChange(false);
    else onChange(null);
  };

  const currentValue = getValue();

  return (
    <View style={styles.radioGroup}>
      <Text style={styles.radioLabel}>{label}</Text>
      <View style={styles.radioButtons}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            currentValue === 'yes' && styles.radioButtonActive,
          ]}
          onPress={() => handlePress('yes')}
        >
          <Text
            style={[
              styles.radioButtonText,
              currentValue === 'yes' && styles.radioButtonTextActive,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.radioButton,
            currentValue === 'no' && styles.radioButtonActive,
          ]}
          onPress={() => handlePress('no')}
        >
          <Text
            style={[
              styles.radioButtonText,
              currentValue === 'no' && styles.radioButtonTextActive,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
        
        {showNA && (
          <TouchableOpacity
            style={[
              styles.radioButton,
              currentValue === 'na' && styles.radioButtonActive,
            ]}
            onPress={() => handlePress('na')}
          >
            <Text
              style={[
                styles.radioButtonText,
                currentValue === 'na' && styles.radioButtonTextActive,
              ]}
            >
              N/A
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const NumberInput: React.FC<{
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  unit?: string;
}> = ({ label, value, onChange, placeholder, unit }) => {
  return (
    <View style={styles.numberInputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.numberInputContainer}>
        <TextInput
          style={styles.numberInput}
          value={value?.toString() || ''}
          onChangeText={(text) => {
            const num = parseInt(text, 10);
            onChange(isNaN(num) ? undefined : num);
          }}
          keyboardType="numeric"
          placeholder={placeholder}
        />
        {unit && <Text style={styles.inputUnit}>{unit}</Text>}
      </View>
    </View>
  );
};

export const InspectionForm: React.FC<InspectionFormProps> = ({
  inspectionType,
  data,
  onChange,
}) => {
  if (inspectionType === 'pre-trip') {
    return (
      <ScrollView style={styles.container}>
        {/* Body Inspection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Inspection</Text>
          <RadioButton
            label="Cab/Box Body OK? (Nothing New to Report)"
            value={data.bodyNewDamage}
            onChange={(v) => onChange('bodyNewDamage', v)}
          />
          <RadioButton
            label="Reverse Sensors All Present/Mounted?"
            value={data.bodyReverseSensors}
            onChange={(v) => onChange('bodyReverseSensors', v)}
          />
        </View>

        {/* Cab Inspection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cab Inspection</Text>
          <RadioButton
            label="Windows OK?"
            value={data.cabWindowsOk}
            onChange={(v) => onChange('cabWindowsOk', v)}
          />
          <RadioButton
            label="Windshield OK?"
            value={data.cabWindshieldOk}
            onChange={(v) => onChange('cabWindshieldOk', v)}
          />
          <RadioButton
            label="Wipers/Blades OK?"
            value={data.cabWipersOk}
            onChange={(v) => onChange('cabWipersOk', v)}
          />
        </View>

        {/* Camera Systems */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Camera Systems</Text>
          <RadioButton
            label="Reverse/Turn Cameras OK?"
            value={data.cameraReverseTurn}
            onChange={(v) => onChange('cameraReverseTurn', v)}
          />
          <RadioButton
            label="VEDR Functional (Green & Blue LEDs Steady)?"
            value={data.cameraVedrFunctional}
            onChange={(v) => onChange('cameraVedrFunctional', v)}
          />
        </View>

        {/* Engine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engine</Text>
          <RadioButton
            label="Air Box and Air Filter OK?"
            value={data.engineAirBoxOk}
            onChange={(v) => onChange('engineAirBoxOk', v)}
          />
          <RadioButton
            label="Battery and Cables OK?"
            value={data.engineBatteryOk}
            onChange={(v) => onChange('engineBatteryOk', v)}
          />
          <RadioButton
            label="Horn OK?"
            value={data.engineHornOk}
            onChange={(v) => onChange('engineHornOk', v)}
          />
          <RadioButton
            label="Hoses, Clamps, Belts OK?"
            value={data.engineHosesOk}
            onChange={(v) => onChange('engineHosesOk', v)}
          />
        </View>

        {/* Fluids */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fluids</Text>
          <RadioButton
            label="Coolant Reservoir OK?"
            value={data.fluidsCoolantOk}
            onChange={(v) => onChange('fluidsCoolantOk', v)}
          />
          <RadioButton
            label="Brake Fluid Reservoir OK?"
            value={data.fluidsBrakeFluidOk}
            onChange={(v) => onChange('fluidsBrakeFluidOk', v)}
          />
          <RadioButton
            label="Engine Oil and Dipstick OK?"
            value={data.fluidsEngineOilOk}
            onChange={(v) => onChange('fluidsEngineOilOk', v)}
          />
          <RadioButton
            label="Power Steering Fluid Level OK?"
            value={data.fluidsPowerSteeringOk}
            onChange={(v) => onChange('fluidsPowerSteeringOk', v)}
          />
          <RadioButton
            label="Radiator and Fluid Levels OK?"
            value={data.fluidsRadiatorOk}
            onChange={(v) => onChange('fluidsRadiatorOk', v)}
          />
          <RadioButton
            label="Vehicle Free of Leaks Underneath?"
            value={data.fluidsNoLeaks}
            onChange={(v) => onChange('fluidsNoLeaks', v)}
          />
          <RadioButton
            label="Wiper Fluid OK?"
            value={data.fluidsWiperFluidOk}
            onChange={(v) => onChange('fluidsWiperFluidOk', v)}
          />
          <RadioButton
            label="Transmission Fluid OK?"
            value={data.fluidsTransmissionOk}
            onChange={(v) => onChange('fluidsTransmissionOk', v)}
            showNA={true}
          />
        </View>

        {/* Lights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lights</Text>
          <RadioButton
            label="Brake Lights OK?"
            value={data.lightsBrakeOk}
            onChange={(v) => onChange('lightsBrakeOk', v)}
          />
          <RadioButton
            label="Cargo Light OK?"
            value={data.lightsCargoOk}
            onChange={(v) => onChange('lightsCargoOk', v)}
          />
          <RadioButton
            label="Dash Lights OK?"
            value={data.lightsDashOk}
            onChange={(v) => onChange('lightsDashOk', v)}
          />
          <RadioButton
            label="Dome Light OK?"
            value={data.lightsDomeOk}
            onChange={(v) => onChange('lightsDomeOk', v)}
          />
          <RadioButton
            label="Hazard Lights OK?"
            value={data.lightsHazardOk}
            onChange={(v) => onChange('lightsHazardOk', v)}
          />
          <RadioButton
            label="Head Lights OK (High and Low Beam)?"
            value={data.lightsHeadOk}
            onChange={(v) => onChange('lightsHeadOk', v)}
          />
          <RadioButton
            label="License Plate Lights OK?"
            value={data.lightsLicensePlateOk}
            onChange={(v) => onChange('lightsLicensePlateOk', v)}
          />
          <RadioButton
            label="Marker Lights OK?"
            value={data.lightsMarkerOk}
            onChange={(v) => onChange('lightsMarkerOk', v)}
          />
          <RadioButton
            label="Reverse Lights OK?"
            value={data.lightsReverseOk}
            onChange={(v) => onChange('lightsReverseOk', v)}
          />
          <RadioButton
            label="Tail Lights OK?"
            value={data.lightsTailOk}
            onChange={(v) => onChange('lightsTailOk', v)}
          />
          <RadioButton
            label="Turn Signals OK?"
            value={data.lightsTurnSignalsOk}
            onChange={(v) => onChange('lightsTurnSignalsOk', v)}
          />
        </View>

        {/* Tires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tires</Text>
          <RadioButton
            label="Lug Nuts Checked?"
            value={data.tiresLugNutsOk}
            onChange={(v) => onChange('tiresLugNutsOk', v)}
          />
          <RadioButton
            label="Rims OK?"
            value={data.tiresRimsOk}
            onChange={(v) => onChange('tiresRimsOk', v)}
          />
          <RadioButton
            label="Spare Tire OK?"
            value={data.tiresSpareOk}
            onChange={(v) => onChange('tiresSpareOk', v)}
            showNA={true}
          />
          
          <Text style={styles.subsectionTitle}>Tire Pressure (PSI)</Text>
          <View style={styles.tireGrid}>
            <NumberInput
              label="Left Front"
              value={data.tiresPsiLf}
              onChange={(v) => onChange('tiresPsiLf', v)}
              placeholder="PSI"
              unit="PSI"
            />
            <NumberInput
              label="Right Front"
              value={data.tiresPsiRf}
              onChange={(v) => onChange('tiresPsiRf', v)}
              placeholder="PSI"
              unit="PSI"
            />
          </View>
          <View style={styles.tireGrid}>
            <NumberInput
              label="Left Rear"
              value={data.tiresPsiLr}
              onChange={(v) => onChange('tiresPsiLr', v)}
              placeholder="PSI"
              unit="PSI"
            />
            <NumberInput
              label="Right Rear"
              value={data.tiresPsiRr}
              onChange={(v) => onChange('tiresPsiRr', v)}
              placeholder="PSI"
              unit="PSI"
            />
          </View>

          <Text style={styles.subsectionTitle}>Tire Tread Depth (32nds)</Text>
          <View style={styles.tireGrid}>
            <NumberInput
              label="Front Left"
              value={data.tiresTreadFl}
              onChange={(v) => onChange('tiresTreadFl', v)}
              placeholder="32nds"
              unit="/32″"
            />
            <NumberInput
              label="Front Right"
              value={data.tiresTreadFr}
              onChange={(v) => onChange('tiresTreadFr', v)}
              placeholder="32nds"
              unit="/32″"
            />
          </View>
          <View style={styles.tireGrid}>
            <NumberInput
              label="Rear Left"
              value={data.tiresTreadRl}
              onChange={(v) => onChange('tiresTreadRl', v)}
              placeholder="32nds"
              unit="/32″"
            />
            <NumberInput
              label="Rear Right"
              value={data.tiresTreadRr}
              onChange={(v) => onChange('tiresTreadRr', v)}
              placeholder="32nds"
              unit="/32″"
            />
          </View>
        </View>

        {/* Tools & Equipment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tools & Equipment</Text>
          <RadioButton
            label="Accident Packet Present?"
            value={data.toolsAccidentPacket}
            onChange={(v) => onChange('toolsAccidentPacket', v)}
          />
          <RadioButton
            label="Booster/Jumper Cables?"
            value={data.toolsBoosterCables}
            onChange={(v) => onChange('toolsBoosterCables', v)}
          />
          <RadioButton
            label="Fire Extinguisher?"
            value={data.toolsFireExtinguisher}
            onChange={(v) => onChange('toolsFireExtinguisher', v)}
          />
          <RadioButton
            label="Functional Package Dolly?"
            value={data.toolsPackageDolly}
            onChange={(v) => onChange('toolsPackageDolly', v)}
          />
          <RadioButton
            label="Handsheets?"
            value={data.toolsHandsheets}
            onChange={(v) => onChange('toolsHandsheets', v)}
          />
          <RadioButton
            label="Jack?"
            value={data.toolsJack}
            onChange={(v) => onChange('toolsJack', v)}
            showNA={true}
          />
          <RadioButton
            label="Tow Straps?"
            value={data.toolsTowStraps}
            onChange={(v) => onChange('toolsTowStraps', v)}
            showNA={true}
          />
          <RadioButton
            label="Triangles?"
            value={data.toolsTriangles}
            onChange={(v) => onChange('toolsTriangles', v)}
          />
          <RadioButton
            label="Vehicle Information Folder?"
            value={data.toolsVehicleFolder}
            onChange={(v) => onChange('toolsVehicleFolder', v)}
          />
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Comments</Text>
          <TextInput
            style={styles.commentsInput}
            value={data.comments || ''}
            onChangeText={(text) => onChange('comments', text)}
            placeholder="Any additional observations, issues, or notes..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    );
  }

  // POST-TRIP INSPECTION
  return (
    <ScrollView style={styles.container}>
      {/* Post-Trip Vehicle Checks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Post-Trip Vehicle Checks</Text>
        <RadioButton
          label="Brakes Sound and Feel OK?"
          value={data.brakesSoundFeel}
          onChange={(v) => onChange('brakesSoundFeel', v)}
        />
        <RadioButton
          label="Gauges Functional/No Warnings?"
          value={data.cabGaugesFunctional}
          onChange={(v) => onChange('cabGaugesFunctional', v)}
        />
        <RadioButton
          label="Seat Belts Latching and Undamaged?"
          value={data.cabSeatBeltsOk}
          onChange={(v) => onChange('cabSeatBeltsOk', v)}
        />
        <RadioButton
          label="Shift Immobilizer OK?"
          value={data.cabShiftImmobilizer}
          onChange={(v) => onChange('cabShiftImmobilizer', v)}
        />
        <RadioButton
          label="Handles (cab/box) OK?"
          value={data.doorsHandlesOk}
          onChange={(v) => onChange('doorsHandlesOk', v)}
        />
        <RadioButton
          label="Locks OK?"
          value={data.doorsLocksOk}
          onChange={(v) => onChange('doorsLocksOk', v)}
        />
        <RadioButton
          label="Mirrors OK?"
          value={data.doorsMirrorsOk}
          onChange={(v) => onChange('doorsMirrorsOk', v)}
        />
      </View>

      {/* End-of-Shift Procedures */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>End-of-Shift Procedures</Text>
        <RadioButton
          label="Clock Out?"
          value={data.proceduresClockOut}
          onChange={(v) => onChange('proceduresClockOut', v)}
        />
        <RadioButton
          label="Close Out Scanner?"
          value={data.proceduresCloseScanner}
          onChange={(v) => onChange('proceduresCloseScanner', v)}
        />
        <RadioButton
          label="Hazmat and Other Paperwork Cleared Out?"
          value={data.proceduresHazmatCleared}
          onChange={(v) => onChange('proceduresHazmatCleared', v)}
        />
        <RadioButton
          label="Remove Trash?"
          value={data.proceduresRemoveTrash}
          onChange={(v) => onChange('proceduresRemoveTrash', v)}
        />
        <RadioButton
          label="Any Reportable On Duty Incidents?"
          value={data.reportableIncidents}
          onChange={(v) => onChange('reportableIncidents', v)}
        />
      </View>

      {/* Driving Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Driving Conditions</Text>
        <Text style={styles.inputLabel}>Select driving conditions</Text>
        <View style={styles.conditionsButtons}>
          {['Clear', 'Foggy', 'Rainy', 'Snowy', 'Windy', 'Slippery'].map(
            (condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.conditionButton,
                  data.drivingConditions === condition &&
                    styles.conditionButtonActive,
                ]}
                onPress={() => onChange('drivingConditions', condition)}
              >
                <Text
                  style={[
                    styles.conditionButtonText,
                    data.drivingConditions === condition &&
                      styles.conditionButtonTextActive,
                  ]}
                >
                  {condition}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Comments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Comments</Text>
        <TextInput
          style={styles.commentsInput}
          value={data.comments || ''}
          onChangeText={(text) => onChange('comments', text)}
          placeholder="Any additional observations, issues, or notes..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: '#333',
  },
  radioButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  radioButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  radioButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  radioButtonTextActive: {
    color: '#fff',
  },
  numberInputGroup: {
    flex: 1,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputUnit: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  tireGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  conditionsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  conditionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  conditionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  conditionButtonTextActive: {
    color: '#fff',
  },
});