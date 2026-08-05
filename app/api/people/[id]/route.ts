import { database, jsonError, requireApiUser } from "../../_lib/data";
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){try{const user=await requireApiUser();const{id}=await params;await database().prepare("DELETE FROM people WHERE id = ? AND owner_id = ?").bind(id,user.userId).run();return Response.json({ok:true});}catch(error){return jsonError(error)}}
