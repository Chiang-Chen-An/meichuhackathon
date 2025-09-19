import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './navigation.css';

function Navigation() {
    /* botton navigation */
    return <nav className="bottom-nav">
        <NavLink
        to="/home"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
        <span className="icon" name="Shop_icon"></span>
        <span className="label">Home</span>
        </NavLink>

        <NavLink
        to="/search"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
        <span className="icon" name="search_icon"></span>
        <span className="label">Search</span>
        </NavLink>

        <NavLink
        to="/saved"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
        <span className="icon" name="saved_icon"></span>
        <span className="label">Saved</span>
        </NavLink>

        <NavLink
        to="/profile"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
        <span className="icon" name="profile_icon"></span>
        <span className="label">profile</span>
        </NavLink>
    </nav>
}

export default Navigation;