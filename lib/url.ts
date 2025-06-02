import qs from "query-string";
interface urlQueryParams {
  params: string;
  key: string;
  value: string;
}
interface removeUrlQueryParams {
  params: string;
  keysToRemove: string[];
}
export const formUrlQuery = ({ params, key, value }: urlQueryParams) => {
  const currentQuery = qs.parse(params);
  currentQuery[key] = value;
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentQuery,
  });
};
export const removeKeysFromUrlQuery = ({
  params,
  keysToRemove,
}: removeUrlQueryParams) => {
  const QueryString = qs.parse(params);
  keysToRemove.forEach((key) => {
    delete QueryString[key];
  });
  return qs.stringifyUrl(
    { url: window.location.pathname, query: QueryString },
    { skipNull: true }
  );
};
