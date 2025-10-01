export interface ICategory {
  id?: number;
  name?: string;
  image?: string;
  isActive?: boolean;
  parentId?: number;
}

export const defaultValue: Readonly<ICategory> = {};
