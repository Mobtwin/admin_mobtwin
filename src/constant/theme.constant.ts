import { PERMISSIONS_ACTIONS } from "./actions.constant";

export const THEME_TABLE = 'theme';

export const THEME_PERMISSIONS = {
    CREATE: `${THEME_TABLE}.${PERMISSIONS_ACTIONS.CREATE}`,
    READ: `${THEME_TABLE}.${PERMISSIONS_ACTIONS.READ}`,
    UPDATE: `${THEME_TABLE}.${PERMISSIONS_ACTIONS.UPDATE}`,
    DELETE: `${THEME_TABLE}.${PERMISSIONS_ACTIONS.DELETE}`,
    READ_OWN: `${THEME_TABLE}.${PERMISSIONS_ACTIONS.READ_OWN}`,
    ASSIGN: `${THEME_TABLE}.${PERMISSIONS_ACTIONS.ASSIGN}`,
    STATUS: `${THEME_TABLE}.${PERMISSIONS_ACTIONS.STATUS}`,
}