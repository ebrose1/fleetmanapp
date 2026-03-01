import apiService from './api';
import { getUnsyncedInspections, markInspectionSynced } from './database';
import { LocalInspection } from '../types';

export const syncInspections = async (): Promise<{
  success: number;
  failed: number;
}> => {
  let successCount = 0;
  let failedCount = 0;

  try {
    // Check if server is reachable
    const isOnline = await apiService.healthCheck();
    if (!isOnline) {
      console.log('Server not reachable, skipping sync');
      return { success: 0, failed: 0 };
    }

    // Get all unsynced inspections
    const unsyncedInspections = await getUnsyncedInspections();
    
    if (unsyncedInspections.length === 0) {
      console.log('No inspections to sync');
      return { success: 0, failed: 0 };
    }

    console.log(`Syncing ${unsyncedInspections.length} inspections...`);

    // Submit each inspection
    for (const inspection of unsyncedInspections) {
      try {
        // Remove local-only fields before sending
        const { localId, synced, createdAt, ...dataToSubmit } = inspection;
        
        await apiService.submitInspection(dataToSubmit);
        await markInspectionSynced(localId);
        successCount++;
        console.log(`Synced inspection ${localId}`);
      } catch (error) {
        console.error(`Failed to sync inspection ${inspection.localId}:`, error);
        failedCount++;
      }
    }

    console.log(`Sync complete: ${successCount} success, ${failedCount} failed`);
    return { success: successCount, failed: failedCount };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: successCount, failed: failedCount };
  }
};

// Auto-sync on app start and periodically
export const startAutoSync = () => {
  // Sync on startup
  syncInspections();

  // Sync every 5 minutes
  setInterval(() => {
    syncInspections();
  }, 5 * 60 * 1000);
};