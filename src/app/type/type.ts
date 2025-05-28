export interface CheckItem {
  id: number;
  name: string;
  isCompleted: boolean;
}

export interface CheckListDetail extends CheckItem {
  tenantId?: string;
  memo?: string;
  imageUrl?: string;
}
