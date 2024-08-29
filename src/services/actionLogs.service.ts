import ActionLog, { IActionLog, IActionLogDocument } from "../models/actionLog.schema";


// create an action log object service // TODO: Implement the type to create an action log object
export const createActionLog = async (action: any): Promise<IActionLogDocument> => {
    try {
        const actionLogEntry = await ActionLog.create(action);
        return actionLogEntry;
    } catch (error: any) {
        throw error;
    }
}