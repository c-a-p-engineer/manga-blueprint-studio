export type LayoutRect={x:number;y:number;w:number;h:number;skew?:string;locked?:boolean};
export type LayoutRecipe={
  id:string;ja:string;en:string;family:string;minPanels:number;maxPanels:number;
  tags:string[];heroPosition?:'first'|'last';helpJa:string;helpEn:string;
};
export const LAYOUT_RECIPE_VERSION:number;
export const LAYOUT_RECIPES:readonly LayoutRecipe[];
export function getLayoutRecipe(id:string):LayoutRecipe|null;
export function listLayoutRecipes(filter?:{panelCount?:number|null;family?:string|null;tag?:string|null}):LayoutRecipe[];
export function layoutRecipeCount():number;
export function buildLayoutRecipe(id:string,options?:{width?:number;height?:number;panelCount?:number;seed?:string|number;mutation?:number}):{recipe:LayoutRecipe;rects:LayoutRect[];settings:{recipeId:string;panelCount:number;seed:string|number;mutation:number}};
export function layoutSettingsSnippet(settings:{recipeId:string;panelCount?:number;seed?:string|number;mutation?:number}):string;
