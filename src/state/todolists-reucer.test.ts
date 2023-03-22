import { TodolistDomainType, FilterValuesType, getTodoListsAC, todolistsReducer } from './todolists-reducer';
import { v1 } from "uuid";

let todoList1: string;
let todoList2: string;

let startState: TodolistDomainType[] = []

beforeEach(() => {
    todoList1 = v1()
    todoList2 = v1()
    startState = [
        {id: todoList1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: todoList2, title: 'What da fuck to do', filter: 'all', addedDate: '', order: 0}
    ]
})

test('set tasks', () => {
    let newFilter: FilterValuesType = 'completed'
    const action = getTodoListsAC(startState)

    let endState = todolistsReducer([], action)

    expect(endState.length).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})