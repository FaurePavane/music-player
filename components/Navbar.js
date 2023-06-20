import React from "react";
import Logo from "../assets/logo.png"

const Navbar = (props) => {

    function toggleLightMode() {
        props.setLightMode(prevLightMode => !prevLightMode)
    }

    return (
        <nav className="navbar unselectable">
            <img className="navbar--logo" src={Logo} />
            <h1 className="navbar--company">Faure</h1>
            <p className="navbar--text">Ca-can you feel it? </p>
            <label class="switch" >
                <input type="checkbox" id="modeToggle" onClick={toggleLightMode} />
                <span class="slider round"></span>
            </label>
        </nav>
    );
};

export default Navbar;
