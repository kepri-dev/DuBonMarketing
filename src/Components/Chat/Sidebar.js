// Sidebar.js

import React from 'react';
import Navbar from './Navbar';
import Search from './Search';
import Conversations from './Conversations';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Navbar />
            {/* <Search /> */}
            <Conversations />
        </div>
    );
};

export default Sidebar;
