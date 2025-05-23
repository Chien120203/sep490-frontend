import PAGE_NAME from "@/constants/route-name.js";

export const RECEIVE_STATUS = 0;
export const PLANNING_STATUS = 1;
export const IN_PROGRESS_STATUS = 2;
export const COMPLETE = 3;
export const WAIT_TO_COMPLETE = 4;
export const CLOSED_STATUS = 6;

export const STATUSES = [
  'project.statuses.receive_reqs',
  'project.statuses.planning',
  'project.statuses.in_progress',
  'project.statuses.complete',
  'project.statuses.wait_to_complete',
  'project.statuses.paused',
  'project.statuses.close',
];

export const STATUS_LABELS = [
  'project.statuses.receive_reqs',
  'project.statuses.planning',
  'project.statuses.in_progress',
  'project.statuses.complete',
  'project.statuses.wait_to_complete',
  'project.statuses.paused',
  'project.statuses.close',
];

export const PROJECT_SIDEBARS = [
  PAGE_NAME.PROJECT.DETAILS,
  PAGE_NAME.PROJECT.EDIT,
  PAGE_NAME.PLANNING.LIST,
  PAGE_NAME.PLANNING.DETAILS,
  PAGE_NAME.CONTRACT.DETAILS,
  PAGE_NAME.PLANNING.CREATE,
  PAGE_NAME.PROGRESS.DETAILS,
  PAGE_NAME.CONSTRUCT_LOG.VIEW,
  PAGE_NAME.CONSTRUCT_LOG.DETAILS,
  PAGE_NAME.RESOURCE_MOBILIZATION.LIST,
  PAGE_NAME.RESOURCE_ALLOCATION.LIST,
  PAGE_NAME.INSPECTION_REPORT.LIST,
  PAGE_NAME.INSPECTION_REPORT.DETAILS,
  PAGE_NAME.INSPECTION_REPORT.CREATE,
  PAGE_NAME.INVENTORY.LIST,
];

export const REQUEST_SIDEBAR = [
  PAGE_NAME.RESOURCE_MOBILIZATION.LIST,
  PAGE_NAME.RESOURCE_ALLOCATION.LIST,
  PAGE_NAME.PROJECT.LIST
]

export const SS_RELATIONSHIP = "SS";
export const SF_RELATIONSHIP = "SF";
export const FS_RELATIONSHIP = "FS";
export const FF_RELATIONSHIP = "FF";

export const TASK_RELATIONSHIPS = [
  {label: "project.task.relation.ss", value: SS_RELATIONSHIP},
  {label: "project.task.relation.sf", value: SF_RELATIONSHIP},
  {label: "project.task.relation.fs", value: FS_RELATIONSHIP},
  {label: "project.task.relation.ff", value: FF_RELATIONSHIP},
];