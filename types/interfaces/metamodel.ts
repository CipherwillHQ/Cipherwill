// Metamodel related interfaces
import { Person } from './people';

export interface Metamodel {
  id: string;
  type: string;
  metadata: string; // JSON string
  folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GetMetamodelQuery {
  getMetamodel: Metamodel;
}

export interface GetMetamodelsQuery {
  getMetamodels: {
    models: Metamodel[];
    has_more: boolean;
  };
}

export interface MetamodelTypeCount {
  type: string;
  count: number;
}

export interface GetMetamodelTypeCountsQuery {
  getMetamodelTypeCounts: MetamodelTypeCount[];
}

// Generic metadata interface - can contain any properties
export interface MetamodelMetadata {
  [key: string]: any; // Allow any additional properties
}

// Query variables for getting a metamodel
export interface GetMetamodelVariables {
  id: string;
}

// Query variables for getting multiple metamodels
export interface GetMetamodelsVariables {
  type?: string;
  cursor?: string;
  folder_id?: string;
}

// Create metamodel mutation variables
export interface CreateMetamodelVariables {
  id?: string;
  type: string;
  metadata: string;
  folder_id?: string;
}

// Create metamodel mutation response
export interface CreateMetamodelMutation {
  createMetamodel: Metamodel;
}

// Update metamodel mutation variables
export interface UpdateMetamodelVariables {
  data: {
    id: string;
    metadata: string;
  };
}

// Update metamodel mutation response
export interface UpdateMetamodelMutation {
  updateMetamodel: Metamodel;
}

// Delete metamodel mutation variables
export interface DeleteMetamodelVariables {
  id: string;
}

// Delete metamodel mutation response
export interface DeleteMetamodelMutation {
  deleteMetamodel: Metamodel;
}

// Key related interfaces
export interface KeyByRefId {
  id: string;
  key: string;
  ref_id: string;
}

export interface GetKeyByRefIdQuery {
  getKeyByRefId: KeyByRefId | null;
}

export interface GetKeyByRefIdVariables {
  ref_id: string;
  publicKey: string;
}

// Pod related interfaces
export interface Pod {
  id: string;
  ref_id: string;
  mime_type: string;
  encoding: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface GetPodQuery {
  getPod: Pod;
}

export interface GetPodVariables {
  ref_id: string;
}

// Folder related interfaces
export interface Folder {
  id: string;
  name: string;
  folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GetFolderQuery {
  getFolder: Folder;
}

export interface GetFolderVariables {
  id: string;
}

export interface GetFoldersQuery {
  getFolders: {
    folders: Folder[];
    has_more: boolean;
  };
}

export interface GetFoldersVariables {
  folder_id?: string;
  cursor?: string;
}

// Factor related interfaces
export interface Factor {
  id: string;
  name: string;
  type: string;
  publicKey: string;
}

export interface GetFactorsQuery {
  getFactors: Factor[];
}

// Key count related interfaces
export interface KeyCount {
  publicKey: string;
  count: number;
}

export interface GetAllKeyCountQuery {
  getAllKeyCount: KeyCount[];
}

export interface GetMyKeyCountQuery {
  getMyKeyCount: KeyCount[];
}

// Update factor mutation interfaces
export interface UpdateFactorVariables {
  id: string;
  name: string;
}

export interface UpdateFactorMutation {
  updateFactor: Factor;
}

// Delete key by public key mutation interfaces
export interface DeleteKeyByPublicKeyVariables {
  publicKey: string;
}

export interface DeleteKeyByPublicKeyMutation {
  deleteKeyByPublicKey: {
    success: boolean;
  };
}

// User profile related interfaces
export interface User {
  id: string;
  email: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  gender?: string;
  country?: string;
  birth_date?: string;
  plan?: string;
  email_verified?: boolean;
  last_accessed?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MeQuery {
  me: User;
}

export interface UpdateUserVariables {
  data: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    gender?: string;
    country?: string;
    birth_date?: string;
  };
}

export interface UpdateUserMutation {
  updateUser: User;
}

export interface Preference {
  id: string;
  key: string;
  value: string | boolean | number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface GetPreferencesQuery {
  getPreferences: Record<string, string | boolean | number>;
}

export interface GetFactorsQuery {
  getFactors: Factor[];
}

export interface RequestAccountReactivationMutation {
  requestAccountReactivation: boolean;
}

export interface UpdatePreferencesVariables {
  key: string;
  value: string;
}

export interface UpdatePreferencesMutation {
  updatePreferences: boolean;
}

export interface SendFeedbackVariables {
  message: string;
}

export interface SendFeedbackMutation {
  sendFeedback: boolean;
}

// Will Events related interfaces
export interface WillEvent {
  id: string;
  type: string;
  execution_time: string;
  created_at: string;
  updated_at: string;
}

export interface GetNextWillEventQuery {
  getNextWillEvent: WillEvent | null;
}

export interface ForceTriggerNextWillEventMutation {
  forceTriggerNextWillEvent: boolean;
}

export interface ResetWillEventsMutation {
  resetWillEvents: boolean;
}

// Storage Usage related interfaces
export interface StorageUsage {
  text_pods: string;
  storage_pods: string;
}

export interface GetStorageUsedQuery {
  getStorageUsed: StorageUsage;
}

// Executor/Granted Metamodel related interfaces
export interface GrantedMetamodel {
  id: string;
  type: string;
  metadata: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface GetGrantedMetamodelQuery {
  getGrantedMetamodel: GrantedMetamodel;
}

export interface GetGrantedMetamodelVariables {
  access_id: string;
  model_id: string;
}

export interface GetGrantedMetamodelsQuery {
  getGrantedMetamodels: {
    models: GrantedMetamodel[];
    has_more: boolean;
  };
}

export interface GetGrantedMetamodelsVariables {
  access_id: string;
  type: string;
  cursor?: string;
  folder_id?: string;
}

// Storage related interfaces
export interface StorageFolder {
  id: string;
  name: string;
  parent_folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface GetGrantedStorageFoldersQuery {
  getGrantedStorageFolders: {
    folders: StorageFolder[];
    has_more: boolean;
  };
}

export interface GetGrantedStorageFoldersVariables {
  access_id: string;
  folder_id?: string;
  cursor?: string;
}

// Delete folder mutation interfaces
export interface DeleteFolderMutation {
  deleteFolder: {
    id: string;
    folder_id?: string;
  };
}

export interface DeleteFolderVariables {
  id: string;
}

// Beneficiary encryption key interfaces
export interface GetBeneficiaryEncryptionKeyQuery {
  getBeneficiaryEncryptionKey: string | null;
}

export interface GetBeneficiaryEncryptionKeyVariables {
  access_id: string;
}

// Beneficiary factors interfaces
export interface BeneficiaryFactor {
  beneficiary_id: string;
  publicKey: string;
  factors: Factor[];
}

export interface GetBeneficiaryFactorsQuery {
  getBeneficiaryFactors: BeneficiaryFactor[];
}

export interface GetPersonByIdsQuery {
  getPersonByIds: Person[];
}

// Access details interfaces for executor system
export interface AccessDetails {
  id: string;
  user: string; // User ID of the donor
  expire_at: string;
  created_at: string;
  updated_at: string;
}

export interface GetAccessDetailsQuery {
  getAccessDetails: AccessDetails;
}

export interface GetAccessDetailsVariables {
  access_id: string;
}

export interface GetAllBeneficiaryAccessQuery {
  getAllBeneficiaryAccess: AccessDetails[];
}

export interface GetAllGrantedBeneficiariesQuery {
  getAllGrantedBeneficiaries: AccessDetails[];
}
