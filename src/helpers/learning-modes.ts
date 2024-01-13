import type { TStudyPlan } from '@/types/assignments'
import { LEARNING_MODES } from '@/consts/learning-modes'

const STUDY_PLANS = {
  NEW_MATERIAL: [
    LEARNING_MODES.ACQUAINTANCE,
    LEARNING_MODES.DICTATION_LIGHT,
    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING_LIGHT,
    LEARNING_MODES.TRANSLATION_LIGHT, 
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  YESTERDAY: [
    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  REFRESH1: [
    LEARNING_MODES.TRANSLATION_LIGHT,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
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

export const getModeIterations = ({
  studyPlan, mode, iterationPeriod = 5
}: {
  studyPlan: any[], mode: string, iterationPeriod: number
}) => {
  const formattedPlan = [
    ...studyPlan,
    ...studyPlan.slice(0, iterationPeriod)
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

export const generatePlan = (langData: Record<string, string>[][]) => {
  const result: TStudyPlan[] = []
  const studyPlansArray = Object.values(STUDY_PLANS)

  if (!(Array.isArray(langData) && langData.length)) {
    return result
  }

  langData.forEach((assignments, index) => {
    studyPlansArray[index].forEach(mode => {
      if (mode.includes('light')) {
        result.push(...assignments.map(assignment => ({
          assignment,
          mode,
        })))
      } else {
        result.push(... getModeIterations({
          studyPlan: assignments,
          mode,
          iterationPeriod: 4
        }))
      }
    })
  })
  return result
}

