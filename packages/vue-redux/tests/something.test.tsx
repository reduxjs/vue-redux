import { describe, expect, it, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'

import type { FieldApi, ValidationErrorMap } from '../src/index'

const user = userEvent.setup()

describe('Something', () => {
  it('should work', async () => {
    const Comp = defineComponent(() => {
      return () => (
        <p>Testing</p>
      )
    })

    const { getByText } = render(<Comp />)
    expect(getByText('Testing')).toBeInTheDocument()
  })
})
