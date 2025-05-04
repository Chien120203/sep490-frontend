export const TIME_LINES = [
  {label: "progress.timeline.day", value: 'Day'},
  {label: "progress.timeline.week", value: 'Week'},
  {label: "progress.timeline.month", value: 'Month'},
  {label: "progress.timeline.year", value: 'Year'},
];

export const PROGRESS_STATUS = [
  'progress.status.not_started',
  'progress.status.in_progress',
  'progress.status.completed',
  'progress.status.paused',
  'progress.status.canceled',
  'progress.status.wait_inspection',
  'progress.status.inspection_failed',
];

export const STATUS_NOT_START = 0;
export const IN_PROGRESS = 1;
export const COMPLETED  = 2;
export const CANCELED  = 4;
export const PAUSED  = 3;
export const WAIT_FOR_INSPECT  = 5;
export const INSPECT_FAILED  = 6;
export const DONE_PROGRESS = 100;
