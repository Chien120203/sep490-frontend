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

export const PROJECT_TO_PROJECT = 1;
export const PROJECT_TO_TASK = 2;
export const TASK_TO_TASK = 3;
export const ALLOCATION_REQUEST_TYPES = [
  {value: PROJECT_TO_PROJECT, label: "allocation.type.project"},
  {value: PROJECT_TO_TASK, label: "allocation.type.project_task"},
  {value: TASK_TO_TASK, label: "allocation.type.task"},
];

export const PRIORITIES = [
  "Low",
  "Medium",
  "High",
]

export const STATUS_LABELS = [
  'mobilization.statuses.draft',
  'mobilization.statuses.wait_manager',
  'mobilization.statuses.manager_approved',
  'mobilization.statuses.bod_approved',
  'mobilization.statuses.rejected',
]