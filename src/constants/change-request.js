export const REQUEST_MOBILIZATION = 0;
export const REQUEST_ALLOCATION = 1;


export const REQUEST_REJECTED = 0;
export const REQUEST_APPROVED = 1;
export const CHANGE_REQUEST_STATUSES = [
  {value: REQUEST_APPROVED, label: 'common.approve'},
  {value: REQUEST_REJECTED, label: 'common.reject'},
];

export const CHANGE_REQUEST_TYPE_ADD = 1;
export const CHANGE_REQUEST_TYPE_UPDATE = 2;
export const CHANGE_REQUEST_TYPES = [
  {value: CHANGE_REQUEST_TYPE_ADD, label: 'change_request.type.add_new'},
  {value: CHANGE_REQUEST_TYPE_UPDATE, label: 'change_request.type.update'},
];

export const CR_STATUS_REJECTED =  0;
export const CR_STATUS_WAIT =  1;
export const CR_STATUS_APPROVED =  2;