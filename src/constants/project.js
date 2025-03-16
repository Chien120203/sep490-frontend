export const RECEIVE_STATUS = 0;
export const PLANNING_STATUS = 1;
export const CLOSED_STATUS = 5;

export const STATUSES = [
  'Receive Request',
  'Planning',
  'InProgress',
  'Completed',
  'Paused',
  'Closed'
];

export const STATUS_LABELS = [
  'project.statuses.receive_reqs',
  'project.statuses.planning',
  'project.statuses.in_progress',
  'project.statuses.complete',
  'project.statuses.paused',
  'project.statuses.close',
];

export const SS_RELATIONSHIP = "SS";
export const SF_RELATIONSHIP = "SF";
export const FS_RELATIONSHIP = "FS";
export const FF_RELATIONSHIP = "FS";

export const TASK_RELATIONSHIPS = [
  {label: "project.task.relation.ss", value: SS_RELATIONSHIP},
  {label: "project.task.relation.sf", value: SF_RELATIONSHIP},
  {label: "project.task.relation.fs", value: FS_RELATIONSHIP},
  {label: "project.task.relation.ff", value: FF_RELATIONSHIP},
];