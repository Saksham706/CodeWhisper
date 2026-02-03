import { useState, useRef, useEffect } from "react";
import "../../styles/navbar.css";

import {
  FiFileText,
  FiTerminal,
  FiMoreVertical,
  FiSettings,
  FiUser,
  FiFolder,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import { useWorkspace } from "../../context/WorkspaceContext";

export default function Navbar() {
  const { openNewTerminal } = useWorkspace();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <img src="/Nlogo.png" alt="NeuroCode Logo" className="logo-img" />
      </div>

      {/* CENTER */}
      <div className="navbar-center">
        <div className="nav-tab">
          <FiFileText />
          <span>Files</span>
        </div>

        <div className="nav-tab">
          <FiFolder />
          <span>Folder</span>
        </div>
        <div className="nav-tab" onClick={openNewTerminal}>
          <FiTerminal />
          <span>Terminal</span>
        </div>

        <div className="nav-tab ai-tab">
          <FaRobot />
          <span>AI Assistant</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right" ref={menuRef}>
        <div className="more-btn" onClick={() => setOpen(!open)}>
          <FiMoreVertical />
        </div>

        {open && (
          <div className="dropdown">
            <div className="dropdown-item">
              <FiSettings />
              <span>Settings</span>
            </div>
            <div className="dropdown-item">
              <FiUser />
              <span>Account</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
