export interface ICategory {
  id?: number;
  name?: string;
  image?: string;
  parentId?: number;
}

export const defaultValue: Readonly<ICategory> = {};
