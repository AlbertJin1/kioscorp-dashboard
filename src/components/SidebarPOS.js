import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const SidebarPOS = ({ handleLogout }) => {
    return (
        <div>
            <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default SidebarPOS;