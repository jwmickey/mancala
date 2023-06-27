import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { mount } from '@vue/test-utils'
import MancalaBoard from '../MancalaBoard.vue'

describe('MancalaBoard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows player 1 turn message', () => {
    const wrapper = mount(MancalaBoard)
    expect(wrapper.text()).toContain('Player One, it\'s your turn!');
  })
})
