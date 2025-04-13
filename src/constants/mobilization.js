export const DRAFT_STATUS = 0;
export const WAIT_MANAGER_APPROVE = 1;
export const MANAGER_APPROVED = 2;
export const BOD_APPROVED = 3;
export const REJECTED = 4;
export const STATUSES = [
  'Draft',
  'Wait Manager Approval',
  'Manager Approved',
  'BOD Approved',
  'Reject'
];

export const PRIORITIES = [
  "Low",
  "Medium",
  "High",
];

export const REQUEST_TYPE_SUPPLY_MORE = 1;
export const REQUEST_TYPE_ADD_NEW = 2;
export const MOBILIZE_REQUEST_TYPES = [
  {value: REQUEST_TYPE_SUPPLY_MORE, label: "mobilization.type.supply_more"},
  {value: REQUEST_TYPE_ADD_NEW, label: "mobilization.type.add_new"},
];

export const STATUS_LABELS = [
  'mobilization.statuses.draft',
  'mobilization.statuses.wait_manager',
  'mobilization.statuses.manager_approved',
  'mobilization.statuses.bod_approved',
  'mobilization.statuses.rejected',
]

export const RESOURCE_TYPE_MATERIALS = 3;
export const RESOURCE_TYPE_VEHICLES = 2;
export const RESOURCE_TYPE_USERS = 1;