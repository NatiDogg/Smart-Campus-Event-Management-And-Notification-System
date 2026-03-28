import React,{useState} from 'react';
import aauLogo from '../assets/aauLogo4.jpg'
import { Link } from 'react-router-dom';
import LandingMain from '../components/public/LandingMain';
import Features from '../components/public/Features.jsx'
import Organizer from '../components/public/Organizer.jsx'
import Privacy from '../components/public/Privacy.jsx'
import Terms from '../components/public/Terms.jsx'
import Support from '../components/public/Support.jsx'
import Contact from '../components/public/Contact.jsx'



const Landing = () => {
     const [page, setPage] = useState('home');
     const components = {
       home: <LandingMain />,
       features: <Features />,
       organizers: <Organizer />,
       contact: <Contact />,
       support: <Support />,
       terms: <Terms />,
       privacy: <Privacy />,
  };
  return (
    <section className=''>
      <header className="max-w-340 mt-2 mx-auto px-4 h-20 flex gap-10 items-center justify-between">
        <div onClick={()=>setPage('home')} className="flex items-center cursor-pointer space-x-1 text-blue-600">
          <div className="">
            <img src={aauLogo} width={50} height={50} alt="aau logo" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            SmartCampus
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500"> 
          <button onClick={()=> setPage('features')}  className="hover:text-blue-600 transition-colors cursor-pointer">Features</button>
          <button onClick={()=> setPage('organizers')}   className="hover:text-blue-600 transition-colors cursor-pointer">Organizers</button>
          <button onClick={()=> setPage('support')}   className="hover:text-blue-600 transition-colors cursor-pointer">Support</button>
          <button onClick={()=> setPage('contact')}   className="hover:text-blue-600 transition-colors cursor-pointer">Contact</button>
       
        </div>
        <div className="flex items-center space-x-4  md:space-x-6">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Login
          </Link>
          <Link
            to="/signin"
            className="p-1 bg-blue-700 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-200 rounded-full px-2 md:px-4 cursor-pointer hover:-translate-y-0.5"
          >
            <button className="cursor-pointer font-semibold px-2  md:py-1 md:px-3 text-nowrap">Join Platform</button>
          </Link>
        </div>
      </header>

        <div className=''>
            {
              components[page] || <LandingMain />
            }
        </div>

      <footer className='py-10 border-t border-gray-100'>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src={aauLogo} alt="" />
             
            </div>
            <span className="font-bold text-gray-900">SmartCampus</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SmartCampus Inc. Built with love for university students.
          </p>
          <div className="flex gap-6 text-sm font-semibold text-gray-400">
           <button onClick={()=> {setPage('privacy'), scrollTo(0,0)}}   className="hover:text-blue-600 transition-colors cursor-pointer">Privacy</button>
            <button onClick={()=> {setPage('terms'), scrollTo(0,0)}}   className="hover:text-blue-600 transition-colors cursor-pointer">Terms</button>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Landing;