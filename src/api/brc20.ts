export const fetchTickList = async () => {
  const resp = await fetch(`/api/brc20/tick/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return data?.data;
}