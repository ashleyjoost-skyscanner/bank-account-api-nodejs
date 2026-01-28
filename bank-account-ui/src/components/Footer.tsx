import React from "react";
import "../styles/Footer.css"; // Optional for styling

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} - BankAccountUI</p>
    </footer>
  );
};

export default Footer;
