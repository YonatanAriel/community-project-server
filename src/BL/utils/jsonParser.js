export const safeJSONParse = (jsonString, fallback = []) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("Failed to parse JSON:", jsonString, error.message);
    return fallback;
  }
};

export const parseMatchingProfileRow = (row) => {
  if (!row) return null;

  return {
    ...row,
    skills: safeJSONParse(row.skills),
    interests: safeJSONParse(row.interests),
    job_titles: safeJSONParse(row.job_titles),
    industries: safeJSONParse(row.industries),
    custom_keywords: safeJSONParse(row.custom_keywords),
  };
};

export const parseMatchingProfileRows = (rows) => {
  return rows.map(parseMatchingProfileRow);
};
