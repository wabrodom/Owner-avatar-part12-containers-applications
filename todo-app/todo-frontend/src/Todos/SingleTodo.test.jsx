import { render, screen } from '@testing-library/react'
import SingleTodo from './SingleTodo'
import userEvent from '@testing-library/user-event'


describe('Renders SingleTodo' ,() => {
  const simpleTodo = {
    text: 'Buy groceries',
    done: false
  }
  
  test('renders content', () => {
    render(<SingleTodo todo={simpleTodo} />)

    screen.getByText(simpleTodo.text)
  })
  
  test('renders "This todo is not done" when to do is not done', () => {
    render(<SingleTodo todo={simpleTodo} />)

    const element = screen.getByText('This todo is not done')
    expect(element).toBeDefined()
  })
  
  test('can click button to complete todo ', async () => {
  
    const mockClickComplete = vi.fn()
    const mockClickDelete = vi.fn()
  
    render(<SingleTodo 
        todo={simpleTodo}
        onClickComplete={mockClickComplete}
        onClickDelete={mockClickDelete}
      />)
  
    const user = userEvent.setup()
    const completeButton = screen.getByText('Set as done')
  
    await user.click(completeButton)
  
    expect(mockClickComplete.mock.calls).toHaveLength(1)
    expect(mockClickDelete.mock.calls).toHaveLength(0)
  })
})