import ActionLog, { IActionLog, IActionLogDocument } from "../models/actionLog.schema";


// create an action log object service
export const createActionLog = async (action: IActionLog): Promise<IActionLogDocument> => {
    try {
        const actionLogEntry = await ActionLog.create(action);
        return actionLogEntry;
    } catch (error: any) {
        throw error;
    }
}