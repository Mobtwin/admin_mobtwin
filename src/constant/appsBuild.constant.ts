import { PERMISSIONS_ACTIONS } from "./actions.constant";


export const APPS_BUILD_TABLE = 'appsBuild';

export const APPS_BUILD_PERMISSIONS = {
    CREATE: `${APPS_BUILD_TABLE}.${PERMISSIONS_ACTIONS.CREATE}`,
    READ: `${APPS_BUILD_TABLE}.${PERMISSIONS_ACTIONS.READ}`,
    UPDATE: `${APPS_BUILD_TABLE}.${PERMISSIONS_ACTIONS.UPDATE}`,
    DELETE: `${APPS_BUILD_TABLE}.${PERMISSIONS_ACTIONS.DELETE}`,
    READ_OWN: `${APPS_BUILD_TABLE}.${PERMISSIONS_ACTIONS.READ_OWN}`,
    ASSIGN: `${APPS_BUILD_TABLE}.${PERMISSIONS_ACTIONS.ASSIGN}`,

}