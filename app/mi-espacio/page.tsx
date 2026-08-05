import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import WorkspaceClient from "./WorkspaceClient";

export const dynamic = "force-dynamic";

export default async function MiEspacio() {
  const user = await requireChatGPTUser("/mi-espacio");
  return <WorkspaceClient displayName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
