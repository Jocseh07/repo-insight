import { Octokit } from "octokit";
import { getToken } from "../user/getToken";

// export const octokit = new Octokit({
//   auth: token,
// });

export const octokitNew = async () => {
  const token = await getToken();
  return new Octokit({
    auth: token,
  });
};
