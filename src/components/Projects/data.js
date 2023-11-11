import xpatris from '../../assets/images/projects/Xpatris.png'
import pinterest from '../../assets/images/projects/pinterest.jpg'
import stackoverflow from '../../assets/images/projects/stackoverflow.jpeg'
import taskList from '../../assets/images/projects/task-list.jpeg'
import weatherReport from '../../assets/images/projects/weather.jpeg'
import recipeSearch from '../../assets/images/projects/recipi.jpeg'
import rockPaperScissors from '../../assets/images/projects/rock_paper_secisor.jpeg'

const projects = [
  {
    id: 1,
    name: 'Xpatris',
    skills: 'NextJS, Firebase, Bootstrap',
    description:
      'This is my Final year Project, Sponsored by Xpatris which is a belgium Startup Company.',
    image: xpatris,
    url: 'https://xpatris-webapp-273h.vercel.app/services/Ghent/ACCOMMODATION',
    github: '',
  },
  {
    id: 2,
    name: 'PinterestLike',
    skills:
      'MERN-Stack, Redux, Coludinary, Tailwind CSS, Babel, Webpack, JWT, AWS ec2/cicd Pipeline ',
    description:
      'I have built a web platform inspired by Pinterest using the MERN Stack, implemented social  features, Infinite scroller, Post Searching, follow user and Responsive design etc. ',
    image: pinterest,
    url: 'https://pinterest-clone-tau.vercel.app/',
    github: 'https://github.com/Ravindra-24/pinterest-clone',
  },
  {
    id: 3,
    name: 'Stackoverflow Clone',
    skills: 'MERN-Stack, Redux, Bootstrap, JWT ',
    description:
      'Developed a StackOverflow clone utilizing the MERN stack (MongoDB, Express.js, React, Node.js) with a focus on creating a feature rich QA platform.',
    image: stackoverflow,
    url: 'https://stackoverflow-clone-ravindra.vercel.app/',
    github: 'https://github.com/Ravindra-24/stackoverflow-clone',
  },
  {
    id: 4,
    name: 'Task List',
    skills: 'MERN-Stack, Redux, Tailwind CSS, JWT ',
    description:
      'This is simple Task management website which is Built on MERN-Stack and Redux.',
    image: taskList,
    url: 'https://task-list-blue.vercel.app/',
    github: 'https://github.com/Ravindra-24/Task_List',
  },

  {
    id: 5,
    name: 'Weather Report',
    skills: 'JavaScript, HTML, CSS, Weather API',
    description:
      'provides the weather report of the city or contry which you search or search by your current location.',
    image: weatherReport,
    url: 'https://ravindra-24.github.io/Weather-Report/',
    github: 'https://github.com/Ravindra-24/Weather-Report',
  },
  {
    id: 6,
    name: 'Recipe Search',
    skills: 'html, css, javascript, Tailwind, API',
    description: 'This is a simple recipe search website.',
    image: recipeSearch,
    url: 'https://ravindra-24.github.io/Recipe_Search/',
    github: 'https://github.com/Ravindra-24/Recipe_Search',
  },
  {
    id: 7,
    name: 'Rock Paper Scissors',
    skills: 'html, css, javascript',
    description: 'This is a simple game website.',
    image: rockPaperScissors,
    url: 'https://ravindra-24.github.io/Rock_Paper_scissor/',
    github: 'https://github.com/Ravindra-24/Rock_Paper_scissor',
  },
]

export default projects
