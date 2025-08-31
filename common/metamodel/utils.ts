import { Metamodel, MetamodelMetadata } from "../../types/interfaces";

/**
 * Safely parse metamodel metadata with type checking
 */
export function parseMetamodelMetadata<T extends MetamodelMetadata = MetamodelMetadata>(
  metamodel: Metamodel
): T {
  try {
    return JSON.parse(metamodel.metadata) as T;
  } catch (error) {
    console.error('Failed to parse metamodel metadata:', error);
    throw new Error('Invalid metamodel metadata format');
  }
}

/**
 * Type guard to check if metadata has the basic required structure
 */
export function isValidMetamodelMetadata(metadata: any): metadata is MetamodelMetadata {
  return metadata && typeof metadata.name === 'string';
}

/**
 * Create a stringified metadata object for updates
 */
export function stringifyMetamodelMetadata(metadata: MetamodelMetadata): string {
  return JSON.stringify(metadata);
}
