import { useState } from 'react'
import './App.css'

// Starts with no course
// Button to add all courses

const coursesAsObjectList = [
  { id: 1, title: "Math", description: "Numbers do number indeed" },
  { id: 2, title: "Antology", description: "Where you study ants" },
  { id: 3, title: "Carpentology", description: "Carpets I think" },
  { id: 4, title: "Foodology", description: "this cant be a real name" },
  { id: 5, title: "Mathematics2", description: "I am done with math ahh" },
]


function App() {

  const [displayedCourses, setDisplayedCourses] = useState([{id: 1, title: "placeholder", description: "No actual courses yet"}])

  const [coursesHaveBeenUpdated, setCoursesHaveBeenUpdated] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')

  function updateDisplayedCourses(){
      setDisplayedCourses(coursesAsObjectList)
      setCoursesHaveBeenUpdated(true)
  }


  // {"condition" && "element"} makes so that element only renders if condition is met
  // Furthermore, we can use ternary to render 2 potential elements
  // {"condition" ? "element1" : "element2"}
  return (
    <div>
    <h1>Course selector</h1>

    {!coursesHaveBeenUpdated && <button onClick={updateDisplayedCourses}> Update all courses </button> } 

    <br/>
    
    <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
    
    {/* ARRAY.filter is a JS function */}
    <CourseCards listOfCourses={displayedCourses.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()))} />
    </div>
  )


}


export default App

// Passing a (getter, setter) useState pair to a child is the perfect React approach.
// CourseCards needs it as an argument, therefore we dont declare they here in Filter, but on the closest common parent, in this case, App
function Filter({searchQuery, setSearchQuery}) {

  return (
    <input 
        value={searchQuery}           // React controls what's displayed
        onChange={(e) => setSearchQuery(e.target.value)}  // user typing updates state → re-render → input updates
    />
  )
}


function CourseCards({listOfCourses}) {

  return (
    <ul>
    {listOfCourses.map((course) => <li key={course.id}> <CourseCard  title={course.title}  description={course.description}  /> </li>)}
  </ul>
  )
}


function CourseCard({title, description}) {

  return (
    <div>

    <h1>{title}</h1>
    
    <br/>

    <p>{description}</p>
    
    </div>
  )
}
