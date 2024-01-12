import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import LearningAssignment from '../learning-assignment.vue'

const assignment = "Il fait beau aujourd'hui"
const answer = "The weather is fine today"
const progressPercent = 30

describe('Learning Assignment ', () => {
  it('displays assignment ', () => {
    const wrapper = mount(LearningAssignment, { props: {
      assignment,
      answer,
      progressPercent
     } })

    const assignmentArea = wrapper.find('h2')
    expect(assignmentArea.text()).toContain(assignment)
  })
})
