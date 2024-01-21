import type { TStudyPlan } from '@/types/assignments'
import { LEARNING_MODES } from '@/consts/learning-modes'

export const PLAN_LEVELS = {
  NORMAL: 'normal',
  LIGHT: 'light',
} as const

const STUDY_PLAN_NORMAL = {
  NEW_MATERIAL: [
    LEARNING_MODES.ACQUAINTANCE_LIGHT,
    LEARNING_MODES.DICTATION_LIGHT,
    LEARNING_MODES.SPEAKING_LIGHT,
    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  YESTERDAY: [
    LEARNING_MODES.DICTATION_LIGHT,
    LEARNING_MODES.TRANSLATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  REFRESH1: [
    LEARNING_MODES.TRANSLATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT,
  ],
  REFRESH2: [
    LEARNING_MODES.TRANSLATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT,
  ],
  REFRESH3: [
    LEARNING_MODES.TRANSLATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT,
  ]
}

const STUDY_PLAN_LIGHT = {
  NEW_MATERIAL: [
    LEARNING_MODES.DICTATION_LIGHT,
    LEARNING_MODES.TRANSLATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  YESTERDAY: [
    LEARNING_MODES.DICTATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT,
  ],
  REFRESH1: [
    LEARNING_MODES.TRANSLATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT,
  ],
  REFRESH2: [
    LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT,
  ],
  REFRESH3: [
    LEARNING_MODES.SPEAKING_AND_TRANSLATION_LIGHT,
  ]
}

export const getModeIterations = ({
  studyPlan, mode, iterationPeriod = 4
}: {
  studyPlan: any[], mode: string, iterationPeriod: number
}) => {
  const formattedPlan = [
    ...studyPlan,
    ...studyPlan.slice(0, iterationPeriod - 1)
  ].map(assignment => ({
    assignment,
    mode,
  }))

  return formattedPlan.reduce((acc: TStudyPlan[], curr, index) => {
    if (index < iterationPeriod) {
      acc.push(curr)
    } else {
      acc.push(curr)
      acc.push(...formattedPlan.slice(index - iterationPeriod + 1, index + 1))
    }
    return acc
  }, [])
}

export const generatePlan = (
  langData: Record<string, string>[][],
  planLevel: typeof PLAN_LEVELS[keyof typeof PLAN_LEVELS] = PLAN_LEVELS.NORMAL
) => {
  const result: TStudyPlan[] = []
  const studyPlansArray = Object.values(
    (planLevel === PLAN_LEVELS.NORMAL)
      ? STUDY_PLAN_NORMAL
      : STUDY_PLAN_LIGHT
    )

  if (!(Array.isArray(langData) && langData.length)) {
    return result
  }

  langData.forEach((assignments, index) => {
    studyPlansArray[index].forEach((mode: typeof LEARNING_MODES[keyof typeof LEARNING_MODES]) => {
      if (mode.includes('light')) {
        result.push(...assignments.map(assignment => ({
          assignment,
          mode,
        })))
      } else {
        const iterationPeriod = index > 1 ? 3 : 2
  
        result.push(... getModeIterations({
          studyPlan: assignments,
          mode,
          iterationPeriod
        }))
      }
    })
  })
  return result
}

export const intenceStudyPlan = () => {

}
