import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Usage from './components/Usage';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Changelog from './components/Changelog';
import Demo from './components/Demo';

function App() {
  return (
    <div className="bg-gray-50">
      <Navbar/>
      <Hero/>
      <Features/>
      <Changelog/>
      <Demo/>
      <Usage/>
      <CallToAction/>
      <Footer/>
    </div>
  );
}

export default App;
