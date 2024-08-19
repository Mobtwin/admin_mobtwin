import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import { THEME_TABLE } from "../constant/theme.constant";
import { Theme } from "../models/builder/theme.schema";
import { ItemSpecificPermissions } from "../models/itemSpecificPermission.schema";
import { CreateTheme, UpdateTheme } from "../validators/theme.validator";
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
    return newTheme;
  } catch (error: any) {
    throw error;
  }
};

// get all themes
export const getAllThemes = async ({
  readOwn = false,
  userId,
}: {
  readOwn: boolean;
  userId: string;
}) => {
  try {
    if (readOwn) {
      const themeIds = await getOwnItemsByPermissionAction(userId,THEME_TABLE,PERMISSIONS_ACTIONS.READ);
      const themes = await Theme.find({ _id: { $in: themeIds } });
      if (!themes) throw new Error("No themes found!");
      return themes;
    }
    const themes = await Theme.find();
    return themes;
  } catch (error: any) {
    throw error;
  }
};

// get theme by id
export const getThemeById = async (id: string) => {
  try {
    const theme = await Theme.findById(id);
    if (!theme) throw new Error("Theme not found!");
    return theme;
  } catch (error: any) {
    throw error;
  }
};

// update theme by id
export const updateTheme = async (id: string, theme: UpdateTheme) => {
  try {
    const updatedTheme = await Theme.findByIdAndUpdate(id, theme, {
      new: true,
    });
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
    );
    if (!deletedTheme) throw new Error("Theme not deleted!");
    return deletedTheme;
  } catch (error: any) {
    throw error;
  }
};
