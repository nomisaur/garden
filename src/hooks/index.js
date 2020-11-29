import { useState, useEffect, useRef, useReducer } from 'react'
import localForage from 'localforage'
import { log } from '../log'
import { clone } from '../utils'

const useFancyReducer = (handlers, initialState) => {
  const [state, setState] = useReducer(
    (state, [action, payload]) => handlers[action](clone(state), payload),
    initialState,
  )

  return [state, (action, payload) => setState([action, payload])]
}

const useInterval = (callback, interval) => {
  const timer = useRef()

  useEffect(() => {
    timer.current = setInterval(callback, interval)
    return () => clearInterval(timer.current)
  }, [])
}

const useTimer = (initialStartTime, initialInterval, tick = 200) => {
  const [startTime, setStartTime] = useState(initialStartTime)
  const [interval, setInterval] = useState(initialInterval)
  const [currentTime, setCurrentTime] = useState(Date.now())

  useInterval(() => setCurrentTime(Date.now()), tick)

  const timerBeeps = Math.floor((currentTime - startTime) / interval)

  const resetTimer = ({ startTime, interval } = {}) => {
    const now = Date.now()
    interval && setInterval(interval)
    setStartTime(startTime || now)
    setCurrentTime(now)
  }

  return [timerBeeps, resetTimer]
}

const useAutoSave = (state, interval) => {
  const stateRef = useRef(state)
  stateRef.current = state
  useInterval(() => {
    localForage
      .setItem('savedState', stateRef.current)
      .then(() => log('auto save'))
      .catch(log)
  }, interval)
}

export { useInterval, useTimer, useAutoSave, useFancyReducer }
