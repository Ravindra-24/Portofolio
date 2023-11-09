import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import './App.scss'
import Certificates from './components/Certificates'
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function App() {
  return (
    <>
      <Routes>
    {/* <Modal/> */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/certificate" element={<Certificates />} />
          <Route path="/project" element={<Certificates />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  )
}


export default App
