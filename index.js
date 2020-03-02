const express = require("express")
const app = express()

const express_graphql = require("express-graphql")
const { buildSchema } = require("graphql")

const { courses } = require("./data.json")

// Defino los datos que tendrá el esquema, tipos de consulta que se pueden realizar
const schema = buildSchema(`
type Query {
  course(id: Int!): Course
  courses(topic: String): [Course]
}

type Mutation {
  updateCourseTopic(id: Int!, topic: String!): Course
}

type Course {
  id: Int
  title: String
  description: String
  author: String
  topic: String
  url: String
}


`)

//Resolvers --> se responde solamente con los datos necesarios
let getCourse = args => {
  let id = args.id
  return courses.filter(course =>{
    return course.id === id
  })[0]
}

let getCourses = (args) => {
  if (args.topic) {
    let topic = args.topic
    return courses.filter(course => {
      return course.topic === topic
    })
  }
  else{
    return courses
  }
}

let updateCourseTopic = (id, topic) => {
  courses.map(course => {
    if (course.id === id) {
      course.topic = topic
      return course
    } 
  })
  return courses.filter(course => {
    course.id === id
  })[0] //map retorna un array, por eso tomo solo la primera posición
}

// root: definición de métodos(funciones)
const root = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic

};

// graphiql: interfaz que permite interactuar con grapql, para realizar las consultas
app.use(
  "/graphql",
  express_graphql({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(3000, () => console.log("Server listening in port 3000"))
