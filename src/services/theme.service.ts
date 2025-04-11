import { generateSignedUrl } from "../config/bucket.config";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { THEME_TABLE } from "../constant/theme.constant";
import { IThemeDocument, Theme } from "../models/builder/theme.schema";
import fetchPaginatedData from "../utils/pagination";
import { CreateTheme, UpdateTheme, UpdateThemeStatus } from "../validators/theme.validator";
import { assignCreatorItemSpecificPermissions, getOwnItemsByPermissionAction } from "./itemSpecificPermissions.service";

// create a new theme
export const createTheme = async (theme: CreateTheme, userId: string) => {
  try {
    const newTheme = await Theme.create(theme);
    if (!newTheme) throw new Error("Theme not created!");
    await assignCreatorItemSpecificPermissions(userId, {
      table: THEME_TABLE,
      itemId: newTheme._id as string,
    });
    const posters = await Promise.all(newTheme.posters.map(async(poster)=>{
      const posterUrl = await generateSignedUrl(poster,60);
      return posterUrl;
    }));
    return {...newTheme,posters};
  } catch (error: any) {
    throw error;
  }
};

// get all themes
export const getAllThemes = async ({
  readOwn = false,
  userId,
  limit,
  skip
}: {
  readOwn: boolean;
  userId: string;
  skip: number;
  limit: number;
}) => {
  try {
    if (readOwn) {
      const themeIds = await getOwnItemsByPermissionAction(userId,THEME_TABLE,PERMISSIONS_ACTIONS.READ);
      const { data, pagination } = await fetchPaginatedData<IThemeDocument>(Theme,skip,limit,{_id: { $in: themeIds },removed_at: null});
      const dataWithUrls = await Promise.all(data.map(async(theme)=>{
        const posters = await Promise.all(theme.posters.map(async(poster)=>{
          const posterUrl = await generateSignedUrl(poster,60);
          return posterUrl;
        }));
        return {...theme._doc, postersWithUrl:posters};
      }));
      return { data:dataWithUrls, pagination };
    }
    const { data, pagination } = await fetchPaginatedData<IThemeDocument>(Theme,skip,limit,{removed_at: null});
    const dataWithUrls = await Promise.all(data.map(async(theme)=>{
      const posters = await Promise.all(theme.posters.map(async(poster)=>{
        const posterUrl = await generateSignedUrl(poster,60);
        return posterUrl;
      }));
      return {...theme._doc, postersWithUrl:posters};
    }));
      return { data:dataWithUrls, pagination };
  } catch (error: any) {
    throw error;
  }
};

// get theme by id
export const getThemeById = async (id: string) => {
  try {
    const theme = await Theme.findById(id).lean();
    if (!theme || theme.removed_at) throw new Error("Theme not found!");
    const posters = await Promise.all(theme.posters.map(async(poster)=>{
      const posterUrl = await generateSignedUrl(poster,60);
      return posterUrl;
    }));
    return {...theme,postersWithUrl:posters};
  } catch (error: any) {
    throw error;
  }
};

// update theme by id
export const updateTheme = async (id: string, theme: UpdateTheme) => {
  try {
    const updatedTheme = await Theme.findOneAndUpdate({_id:id,removed_at: null}, theme, {
      new: true,
    }).lean();
    if (!updatedTheme) throw new Error("Theme not updated!");
    const posters = await Promise.all(updatedTheme.posters.map(async(poster)=>{
      const posterUrl = await generateSignedUrl(poster,60);
      return posterUrl;
    }));
    return {...updatedTheme,postersWithUrl:posters};
  } catch (error: any) {
    throw error;
  }
};
// update theme status by id
export const updateThemeStatus = async (id: string, theme: UpdateThemeStatus) => {
  try {
    const updatedTheme = await Theme.findByIdAndUpdate(id, theme, {
      new: true,
    }).lean();
    if (!updatedTheme) throw new Error("Theme not updated!");
    return updatedTheme;
  } catch (error: any) {
    throw error;
  }
};

// delete theme by id
export const deleteTheme = async (id: string) => {
  try {
    const deletedTheme = await Theme.findByIdAndUpdate(
      id,
      { removed_at: new Date() },
      { new: true }
    ).lean();
    if (!deletedTheme) throw new Error("Theme not deleted!");
    return deletedTheme;
  } catch (error: any) {
    throw error;
  }
};
