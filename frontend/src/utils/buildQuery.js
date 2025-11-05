function buildQuery(params) {
  const url = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach(item => url.append(k, item));
    } else if (v !== undefined && v !== null && v !== "") {
      url.append(k, v);
    }
  });
  return url.toString();
}

export default buildQuery;
