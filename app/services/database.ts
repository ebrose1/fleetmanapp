import * as SQLite from 'expo-sqlite';
import { LocalInspection } from '../types';

const db = SQLite.openDatabase('fleet_inspections.db');

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS inspections (
          localId TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          synced INTEGER DEFAULT 0,
          createdAt INTEGER NOT NULL
        );`,
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const saveInspectionLocally = async (
  inspection: Omit<LocalInspection, 'localId' | 'createdAt'>
): Promise<string> => {
  const localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = Date.now();
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO inspections (localId, data, synced, createdAt) VALUES (?, ?, ?, ?);',
        [localId, JSON.stringify({ ...inspection, localId, createdAt }), 0, createdAt],
        () => resolve(localId),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getUnsyncedInspections = (): Promise<LocalInspection[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT data FROM inspections WHERE synced = 0 ORDER BY createdAt ASC;',
        [],
        (_, { rows }) => {
          const inspections = [];
          for (let i = 0; i < rows.length; i++) {
            inspections.push(JSON.parse(rows.item(i).data));
          }
          resolve(inspections);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const markInspectionSynced = (localId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE inspections SET synced = 1 WHERE localId = ?;',
        [localId],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteInspection = (localId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM inspections WHERE localId = ?;',
        [localId],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};