export type RoleBias =
  | "finance"
  | "product"
  | "legal"
  | "marketing"
  | "strategy"
  | "operations";

export interface CouncilRole {
  id: string;
  name: string;
  title: string;
  bias: RoleBias;
  description: string;
  avatar: string;
  color: string;
}

export interface MeetingSlot {
  id: string;
  roleId: string | null;
}