import type { TStudyPlan } from '@/types/assignments'
import { LEARNING_MODES } from '@/consts/learning-modes'

const STUDY_PLANS = {
  NEW_MATERIAL: [
    LEARNING_MODES.ACQUAINTANCE, // linear
    LEARNING_MODES.ACQUAINTANCE,

    LEARNING_MODES.DICTATION, // linear

    LEARNING_MODES.TRANSLATION, // iterational
    LEARNING_MODES.SPEAKING, // iterational

    LEARNING_MODES.TRANSLATION, 
    LEARNING_MODES.SPEAKING_AND_TRANSLATION, // iterational
  ],
  YESTERDAY: [
    LEARNING_MODES.ACQUAINTANCE,

    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING,

    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  REFRESH1: [
    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING,

    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  REFRESH2: [
    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
  ],
  REFRESH3: [
    LEARNING_MODES.TRANSLATION,
    LEARNING_MODES.SPEAKING_AND_TRANSLATION,
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

  langData.forEach((assignments, index) => {
    studyPlansArray[index].forEach(mode => {
      if (mode === LEARNING_MODES.ACQUAINTANCE || mode === LEARNING_MODES.DICTATION) {
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

