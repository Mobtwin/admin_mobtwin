import { PERMISSIONS_ACTIONS } from "./actions.constant";


export const USER_TABLE = 'user';

export const USER_PERMISSIONS = {
    CREATE: `${USER_TABLE}.${PERMISSIONS_ACTIONS.CREATE}`,
    READ: `${USER_TABLE}.${PERMISSIONS_ACTIONS.READ}`,
    UPDATE: `${USER_TABLE}.${PERMISSIONS_ACTIONS.UPDATE}`,
    DELETE: `${USER_TABLE}.${PERMISSIONS_ACTIONS.DELETE}`,
    READ_OWN: `${USER_TABLE}.${PERMISSIONS_ACTIONS.READ_OWN}`,
    ASSIGN: `${USER_TABLE}.${PERMISSIONS_ACTIONS.ASSIGN}`,
}