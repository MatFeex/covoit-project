import React from 'react';
import "./footer.scss";

function Footer() {
    return (
        <footer className="fixed-bottom p-2 bg-footer">
            <div className="container">
                <span className="d-block px-3 text-end">EPF Co'Drive - 2023</span>
            </div>
        </footer>
    );
}

export default Footer;