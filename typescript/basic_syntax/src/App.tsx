import { useState } from 'react'


// Declares a type of prop
// "interface" and "type" are almost the same
interface CourseCardProps {
  title: string
  description: string
  extras?: string  // "?" makes the field optional
}

const age: number = 21
const name: string = "Ana"
const active: boolean = true

const allTheCourses: CourseCardProps[] = []
const titles: string[] = []

type Status = 'loading' | 'success' | 'error'


function App() {
  
  // <"type"> is a generic for the useState function
  // Most of the times it is not needed, and TS can infer it
const [courses, setCourses] = useState<CourseCardProps[]>([])

  const myCourse : CourseCardProps = {title : "medology", description : "study of medos"}

  return (
  <div>

  <h1>Hello TypeScript</h1>
  <CourseCard title={myCourse.title} description={myCourse.description}/>
  
  </div>
  )
}


export default App


function CourseCard({ title, description }: CourseCardProps) { // Type on the argument. But still use {a, b, c}:"type" notation
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}