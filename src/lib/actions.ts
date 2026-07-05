"use server";

import { revalidatePath } from "next/cache";

// Pages are fully static (cached indefinitely) for speed — this is the only
// thing that pulls fresh data from the DW, triggered by the "Refresh data"
// button rather than on every page visit.
export async function refreshPath(path: string) {
  revalidatePath(path);
}
