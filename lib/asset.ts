const repoName = "reveste-brecho"; // mesmo nome do repositório
const prefix = process.env.NODE_ENV === "production" ? `/${repoName}` : "";

export const asset = (path: string) =>
  `${prefix}${path.startsWith("/") ? path : `/${path}`}`;