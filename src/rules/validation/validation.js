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


export function validateChooseDateRelation(rule, value, callback, selectedRow, planList, isPlanning = true, isActual = false) {

  const result = validateTaskDateRelation(selectedRow, planList, isPlanning, isActual);
  if (!result.valid) {
    callback(new Error(result.message));
  } else {
    callback();
  }
}

export function validateChooseTypeRelation(rule, value, callback, selectedRow, planList, isPlanning = true) {
  const result = validateRelationTypeChange(rule.relatedIndex, selectedRow, planList, isPlanning);
  if (!result.valid) {
    callback(new Error(result.message));
  } else {
    callback();
  }
}

const validateRelationTypeChange = (depIndex, selectedRow, planningList, isPlanning = true) => {
  const selectedIndex = selectedRow.index;
  const startAbove = isPlanning ? selectedRow.startDate : selectedRow.planStartDate;
  const endAbove = isPlanning ? selectedRow.endDate : selectedRow.planEndDate;
  const itemRelations = selectedRow.itemRelations;

  // Find the related task
  const relatedTask = isPlanning
    ? planningList.planItems.find(item => item.index === depIndex)
    : planningList.find(item => item.index === depIndex);

  if (!relatedTask) {
    return {
      valid: false,
      message: i18n.global.t("planning.errors.select_date", { relatedTaskIndex: depIndex })
    };
  }

  const startUnder = isPlanning ? relatedTask.startDate : relatedTask.planStartDate;
  const endUnder = isPlanning ? relatedTask.endDate : relatedTask.planEndDate;

  if (!startUnder || !endUnder) {
    return {
      valid: false,
      message: i18n.global.t("planning.errors.select_date", { relatedTaskIndex: depIndex })
    };
  }

  // Validate the relation
  const isValid = checkDateRelation(startAbove, endAbove, startUnder, endUnder, itemRelations[depIndex]);
  if (!isValid) {
    return {
      valid: false,
      message: generateErrorMessage(selectedIndex, itemRelations[depIndex], depIndex)
    };
  }

  return { valid: true };
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

const validateTaskDateRelation = (selectedRow, planningList, isPlanning, isActual) => {
  const selectedIndex = selectedRow.index;

  // Update this section to handle isActual flag
  let startAbove, endAbove;

  if (isActual) {
    startAbove = selectedRow.actualStartDate;
    endAbove = selectedRow.actualEndDate;
  } else {
    startAbove = isPlanning ? selectedRow.startDate : selectedRow.planStartDate;
    endAbove = isPlanning ? selectedRow.endDate : selectedRow.planEndDate;
  }

  const itemRelations = selectedRow.itemRelations;

  const getTaskDates = (task) => {
    if (isActual) {
      return {
        start: task.actualStartDate,
        end: task.actualEndDate
      };
    }
    return {
      start: isPlanning ? task.startDate : task.planStartDate,
      end: isPlanning ? task.endDate : task.planEndDate
    };
  };

  // Rest of the function remains the same
  // Check if there are relations for this task
  if (itemRelations) {
    for (let key in itemRelations) {
      const relationType = itemRelations[key];
      const relatedTask = isPlanning
        ? planningList.planItems.find(item => item.index === key)
        : planningList.find(item => item.index === key);

      if (relatedTask) {
        const {start: startUnder, end: endUnder} = getTaskDates(relatedTask);
        const isValid = checkDateRelation(startAbove, endAbove, startUnder, endUnder, relationType);
        if (!isValid) {
          return {
            valid: false,
            message: generateErrorMessage(key, relationType, selectedIndex)
          };
        }
      }
    }
  }

  // If no direct relation, check other tasks for reverse relations
  const tasks = isPlanning ? planningList.planItems : planningList;
  for (let task of tasks) {
    if (task.itemRelations && task.itemRelations[selectedIndex]) {
      const relationType = task.itemRelations[selectedIndex];
      const {start: taskStart, end: taskEnd} = getTaskDates(task);
      const isValid = checkDateRelation(taskStart, taskEnd, startAbove, endAbove, relationType);
      if (!isValid) {
        return {
          valid: false,
          message: generateErrorMessage(selectedIndex, relationType, task.index)
        };
      }
    }
  }

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
