export const completionStatuses = {
  IN_FOCUS: 'in-focus',
  ERROR: 'error',
  SOLVED: 'solved',
} as const

export type TCompletionStatusesKeys = keyof typeof completionStatuses
export type TCompletionStatusesClasses = (typeof completionStatuses)[TCompletionStatusesKeys]

export type TStudyPlan = {
  assignment: Record<string, string>,
  mode: string
}
