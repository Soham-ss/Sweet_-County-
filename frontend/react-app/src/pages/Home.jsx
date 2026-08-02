import React, { useState } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';
import BakeryGridBackground from '../components/BakeryGridBackground';

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <>
      <Hero />
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Full-Bleed Background Layer stretching across entire screen width */}
        <BakeryGridBackground />

        <section className="discovery-section" style={{ position: 'relative', zIndex: 10 }}>
          <SearchBar 
              setSearchQuery={setSearchQuery} 
              category={category} 
              setCategory={setCategory} 
          />
          <ProductGrid 
              category={category} 
              searchQuery={searchQuery} 
          />
        </section>
      </div>
    </>
  );
};

export default Home;
