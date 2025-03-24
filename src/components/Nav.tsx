import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="nav">
      <ul className="flex space-x-6">
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Search Candidates
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/SavedCandidates" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Saved Candidates
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
