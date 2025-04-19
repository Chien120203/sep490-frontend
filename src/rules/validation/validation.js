import {i18n} from '@/utils/i18n.js';

export function validateMinMax(rule, value, callback, min, max, minMessage, maxMessage) {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    callback(new Error("Value must be a number"));
  } else if (numValue < min) {
    callback(new Error(minMessage));
  } else if (numValue > max) {
    callback(new Error(maxMessage));
  } else {
    callback(); // Validation passed
  }
}

export function validateStartBeforeEnd(rule, value, callback, startDate, endDate, message) {
  if (!startDate || !endDate) {
    callback();
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Normalize both dates to midnight (00:00:00)
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start > end) {
    callback(new Error(i18n.global.t(message))); // i18n message key
  } else {
    callback();
  }
}

export function validateDateBetween(rule, value, callback, startDate, endDate, message) {
  if (!startDate || !endDate || !value) {
    callback();
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const selectDate = new Date(value);

  // Normalize both dates to midnight (00:00:00)
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  selectDate.setHours(0, 0, 0, 0);

  if (selectDate < start || selectDate > end) {
    callback(new Error(i18n.global.t(message))); // i18n message key
  } else {
    callback();
  }
}


export function validateChooseDateRelation(rule, value, callback, selectedRow, planList) {

  const result = validateTaskDateRelation(selectedRow, planList);
  if (!result.valid) {
    callback(new Error(result.message));
  } else {
    callback();
  }
}

export function validateChooseTypeRelation(rule, value, callback, selectedRow, planList) {
  const result = validateRelationTypeChange(rule.relatedIndex, selectedRow, planList);
  if (!result.valid) {
    callback(new Error(result.message));
  } else {
    callback();
  }
}

const validateRelationTypeChange = (depIndex, selectedRow, planningList) => {
  const {index: selectedIndex, startDate: startAbove, endDate: endAbove, itemRelations} = selectedRow;

  // Get the related task's index and find the related task
  const relatedTask = planningList.planItems.find(item => item.index === depIndex);
  let relatedTaskIndex = relatedTask.index;
  if(!relatedTask || !relatedTask.startDate || !relatedTask.endDate) {
    return {
      valid: false,
      message: i18n.global.t("planning.errors.select_date", { relatedTaskIndex })
    };
  }

  if (relatedTask) {
    const {startDate: startUnder, endDate: endUnder} = relatedTask;
    // Check if the new relation type satisfies the date constraints
    const isValid = checkDateRelation(startAbove, endAbove, startUnder, endUnder, itemRelations[depIndex]);
    if (!isValid) {
      return {
        valid: false,
        message: generateErrorMessage(selectedIndex, itemRelations[depIndex], depIndex)
      };
    }
  }

  // If there's no change or the relation is empty, skip the validation
  return {
    valid: true,
  };
};

const generateErrorMessage = (relatedTaskIndex, relationType, currentTaskIndex) => {
  switch (relationType) {
    case 'SS': // Start-to-Start
      return i18n.global.t("planning.errors.SS", { currentTaskIndex, relatedTaskIndex });
    case 'FF': // Finish-to-Finish
      return i18n.global.t("planning.errors.FF", { currentTaskIndex, relatedTaskIndex });
    case 'SF': // Start-to-Finish
      return i18n.global.t("planning.errors.SF", { currentTaskIndex, relatedTaskIndex });
    case 'FS': // Finish-to-Start
      return i18n.global.t("planning.errors.FS", { currentTaskIndex, relatedTaskIndex });
    default:
      return `Invalid relation type "${relationType}" between Task ${relatedTaskIndex} and Task ${currentTaskIndex}.`;
  }
};

const validateTaskDateRelation = (selectedRow, planningList) => {
  const {index: selectedIndex, startDate: startAbove, endDate: endAbove, itemRelations} = selectedRow;

  // Check if there are relations for this task
  if (itemRelations) {
    for (let key in itemRelations) {
      let relationType = itemRelations[key];
      const relatedTaskIndex = key;
      const relatedTask = planningList.planItems.find(item => item.index === key);
      const {startDate: startUnder, endDate: endUnder} = relatedTask;
      const isValid = checkDateRelation(startAbove, endAbove, startUnder, endUnder, relationType);
      if (!isValid) {
        return {
          valid: false,
          message: generateErrorMessage(relatedTaskIndex, relationType, selectedIndex)
        };
      }
    }
  }

  // If no direct relation, check other tasks for relations
  for (let task of planningList.planItems) {
    const {index, itemRelations} = task;
    if (itemRelations && itemRelations[selectedIndex]) {
      const relationType = itemRelations[selectedIndex];

      const isValid = checkDateRelation(task.startDate, task.endDate, startAbove, endAbove, relationType);
      if (!isValid) {
        return {
          valid: false,
          message: generateErrorMessage(selectedIndex, relationType, task.index)
        };
      }
    }
  }

  // If no relation exists or all checks pass, consider it valid
  return {valid: true};
};

// Check if the date relation satisfies the given relation type
const checkDateRelation = (startAbove, endAbove, startUnder, endUnder, relationType) => {
  switch (relationType) {
    case 'SS': // Start-to-Start
      return new Date(startUnder) >= new Date(startAbove);
    case 'FF': // Finish-to-Finish
      return new Date(endUnder) >= new Date(endAbove);
    case 'SF': // Start-to-Finish
      return new Date(endUnder) >= new Date(startAbove);
    case 'FS': // Finish-to-Start
      return new Date(startUnder) >= new Date(endAbove);
    default:
      return false; // Invalid relation type
  }
};
