"use server";

import { redirect } from "next/navigation";
import type { ZodError } from "zod";
import { formatZodError } from "@/lib/http";
import { createLog, deleteLog, getLog, updateLog } from "@/lib/logs";
import {
  createLogSchema,
  logIdSchema,
  logInputFromFormData,
  updateLogSchema,
} from "@/lib/validation";

export async function createLogAction(formData: FormData) {
  const input = createLogSchema.safeParse(logInputFromFormData(formData));
  if (!input.success) {
    redirect(withError("/logs/new", input.error));
  }

  const log = await createLog(input.data);
  redirect(`/logs/${log.id}`);
}

export async function updateLogAction(formData: FormData) {
  const id = logIdSchema.parse(formData.get("id"));
  const input = updateLogSchema.safeParse(logInputFromFormData(formData));
  if (!input.success) {
    redirect(withError(`/logs/${id}`, input.error));
  }

  await updateLog(id, input.data);
  redirect(`/logs/${id}`);
}

export async function deleteLogAction(formData: FormData) {
  const id = logIdSchema.parse(formData.get("id"));
  if (await getLog(id)) {
    await deleteLog(id);
  }
  redirect("/logs");
}

/** Backs out of a failed save with the validation message in tow. */
function withError(path: string, error: ZodError): string {
  return `${path}?error=${encodeURIComponent(formatZodError(error))}`;
}
