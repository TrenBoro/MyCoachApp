import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Home from './components/Home'
import ProfileHeader from './components/profile/ProfileHeader'
import RequireAuth from './components/RequireAuth'
import LogoutLink from './components/LogoutLink'
import CreateWorkout from './components/Workouts/CreateWorkout'
import MyWorkouts from './components/Workouts/MyWorkouts'
import useAuth from './context/AuthContext'
import Profile from './components/profile/Profile'
import WorkoutDetail from './components/Workouts/WorkoutDetail'
import ExerciseList from './components/Exercises/ExerciseList'
import { ExercisesProvider } from './context/ExerciseContext'
import AddExercise from './components/Exercises/AddExercise'

function App() {
  const { user } = useAuth();

  return (
    <ExercisesProvider>
      <Router>
        <header className='header'>
          < ProfileHeader />
          <nav className='nav-links'>
            {user && 
              <>
                <Link to="/">Home</Link>
                <Link to="/statistics">Statistics</Link>
                <LogoutLink></LogoutLink>
              </>
            }
          </nav>
        </header>
        <Routes>
          <Route path="/" element={
            <RequireAuth>
              <Home/>
            </RequireAuth>
          } />
          <Route path="/my-workouts" element={
            <RequireAuth>
              <MyWorkouts/>
            </RequireAuth>
          }/>
          <Route path="/my-workouts/:id" element={
            <RequireAuth>
              <WorkoutDetail/>
            </RequireAuth>
          }/>
          <Route path='/create-workout' element={<CreateWorkout/>}/>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path='/pick-exercise' element={<ExerciseList/>}/>
          <Route path='/add-exercise' element={<AddExercise/>}/>
        </Routes>
      </Router>
    </ExercisesProvider>
  )
}

export default App
