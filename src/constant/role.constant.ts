import { PERMISSIONS_ACTIONS } from "./actions.constant";


export const ROLE_TABLE = 'role';

export const ROLE_PERMISSIONS = {
    CREATE: `${ROLE_TABLE}.${PERMISSIONS_ACTIONS.CREATE}`,
    READ: `${ROLE_TABLE}.${PERMISSIONS_ACTIONS.READ}`,
    UPDATE: `${ROLE_TABLE}.${PERMISSIONS_ACTIONS.UPDATE}`,
    DELETE: `${ROLE_TABLE}.${PERMISSIONS_ACTIONS.DELETE}`,
    READ_OWN: `${ROLE_TABLE}.${PERMISSIONS_ACTIONS.READ_OWN}`,
    ASSIGN: `${ROLE_TABLE}.${PERMISSIONS_ACTIONS.ASSIGN}`,
}