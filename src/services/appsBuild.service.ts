import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { APPS_BUILD_TABLE } from "../constant/appsBuild.constant";
import { AppsBuild, IAppsBuildDocument } from "../models/builder/apps.schema";
import fetchPaginatedData from "../utils/pagination";
import { CreateAppsBuild, UpdateAppsBuild } from "../validators/appsBuild.validator";
import { getOwnItemsByPermissionAction } from "./itemSpecificPermissions.service";

//create a new app build
export const createAppBuild = async (appData:CreateAppsBuild,userId:string) => {
    try {
        const appBuild = await AppsBuild.create({...appData,userId});
        if(!appBuild)
            throw new Error("Error while creating app build");
        return appBuild;
    } catch (error:any) {
        throw error;
    }
}

//update an existing app build
export const updateAppBuild = async (appData:UpdateAppsBuild,id:string) => {
    try {
        const appBuild = await AppsBuild.findByIdAndUpdate(id,appData,{new:true});
        if(!appBuild)
            throw new Error("Error while updating app build");
        return appBuild;
    } catch (error:any) {
        throw error;
    }
}

// get all app builds
export const getAllAppsBuild = async ({readOwn=false,userId,skip,limit}:{readOwn:boolean,userId:string,skip:number,limit:number}) => {
    try {
        if(readOwn){
            const appBuildIds = await getOwnItemsByPermissionAction(userId,APPS_BUILD_TABLE,PERMISSIONS_ACTIONS.READ)
            const {data,pagination} = await fetchPaginatedData<IAppsBuildDocument>(AppsBuild,skip,limit,{_id:{$in:appBuildIds}});
            return {data,pagination};
        }
        const {data,pagination} = await fetchPaginatedData<IAppsBuildDocument>(AppsBuild,skip,limit,{});
        return {data,pagination};
    } catch (error:any) {
        throw error;
    }
}

// get an app build by ID
export const getAppBuildById = async (id:string) => {
    try {
        const appBuild = await AppsBuild.findById(id);
        if(!appBuild)
            throw new Error("App build not found");
        return appBuild;
    } catch (error:any) {
        throw error;
    }
}

// soft delete an app build
export const deleteAppBuild = async (id:string) => {
    try {
        const appBuild = await AppsBuild.findByIdAndUpdate(id,{removed_at:new Date()},{new:true});
        if(!appBuild)
            throw new Error("Error while deleting app build");
        return appBuild;
    } catch (error:any) {
        throw error;
    }
}












