export const HttpResponse = <T>(body: T, status: number) => {
  return {
    status,
    body,
  };
};
