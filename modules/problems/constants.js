const EntityType = {
  PROBLEM: "problem",
  SERVICE: "service",
};

const ORDER_BY_CREATION = {
  DESC: "DESC",
  ASC: "ASC",
};

const PROBLEM_STATUS = {
  OPEN: "open",
  ASSIGNED: "assigned",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const OFFER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
};

module.exports = {
  EntityType,
  ORDER_BY_CREATION,
  PROBLEM_STATUS,
  OFFER_STATUS,
};
