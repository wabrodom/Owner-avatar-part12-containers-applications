import { render, screen } from '@testing-library/react'
import LoginContainer from './LogInContainer'
import userEvent from '@testing-library/user-event'

describe('Render LoginContainer', () => {
  test('element can render', () => {

    render(<LoginContainer />)

    screen.getByRole("button", {name: "Log In" })
  })

  test('login button will call if user provide username & password', async () => {
    const mockClick = vi.fn()
  
    render(<LoginContainer handleLogin={mockClick}/>)

    const user = userEvent.setup()
    const inputUsername = screen.getByPlaceholderText('Username')
    const inputPassword = screen.getByPlaceholderText('Password')
    const loginButton = screen.getByRole('button', { name: "Log In" } )
  
    await user.click(loginButton)
    expect(mockClick.mock.calls).toHaveLength(0)

    await user.type(inputUsername, 'bom')
    expect(inputUsername).toHaveValue('bom')
    await user.type(inputPassword, 'secret')
    expect(inputPassword).toHaveValue('secret')

    await user.click(loginButton)
    expect(mockClick.mock.calls).toHaveLength(1)
  })
})