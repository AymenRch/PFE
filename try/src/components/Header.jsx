import React , {useState} from 'react'
import { FaBars, FaTimes } from "react-icons/fa";
import './header.css'

const Header = () => {
 const [click, setClick] = useState(false);
   const handleClick = () => setClick(!click);
 
   const [color, setColor] = useState(false);
   const changeColor = () => {
     if (window.scrollY >= 100) {
       setColor(true);
     } else {
       setColor(false);
     }
   };
 
   window.addEventListener("scroll", changeColor);
 
   return (
     <div className={color ? "main-header header-bg" : "main-header"}>
          <div className={color? "footer-logo" : "footer-logo footer-logo3"}>Grow<span style={{color:'#00915C'}}>Vest</span></div>
       <ul className={click ? "main-nav-menu active" : "main-nav-menu"}>
         <li>
           <a href="#hero">Home</a>
         </li>
         <li>
           <a href="#about">About</a>
         </li>
         <li>
           <a href="#features">Project</a>
         </li>
         <li>
           <a href="#contact">Contact</a>
         </li>
       </ul>
       <div className="hamburger" onClick={handleClick}>
         {click ? (
           <FaTimes size={20} style={{ color: "white" }} />
         ) : (
           <FaBars size={20} style={{ color: "white" }} />
         )}
       </div>
     </div>
   );
 };


export default Header