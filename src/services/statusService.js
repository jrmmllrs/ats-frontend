import api from "../api/axios";

export const updateStatusHistory = (record, userID) => {
  const res = api.put(`applicant/status-history/${record.history_id}`, {
    status: record.status,
    edited: 1,
    deleted: record.deleted,
    changed_by: userID,
    changed_at: record.changed_at,
  });
  return res.data;
};

export const deleteStatusHistory = (record, userID) => {
  const res = api.put(`applicant/status-history/${record.history_id}/delete`, {
    deleted: 1,
    changed_by: userID,
  });
  return res.data;
};
