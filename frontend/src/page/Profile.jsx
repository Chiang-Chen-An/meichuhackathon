import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';
import Navigation from '../components/navigation';

function ProfilePage() {
  const [name, setName] = useState('unknownUser');
  const [email, setEmail] = useState('unknownUser@google.com');
  
  const buttons = ['Edit Profile', 'Log Out', 'Log In', 'Sign Up'];

  const [focusedButtonIndex, setFocusedButtonIndex] = useState(-1); 

  const buttonRefs = useRef([]);
  buttonRefs.current = buttons.map(
    (_, i) => buttonRefs.current[i] ?? React.createRef()
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isFocusableElement = document.activeElement && 
                                 (document.activeElement.tagName === 'BUTTON' || 
                                  document.activeElement === document.body ||
                                  buttonRefs.current.some(ref => ref.current && ref.current.contains(document.activeElement)));
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault(); 
          setFocusedButtonIndex((prevIndex) => {
            if (prevIndex === -1) return 3;
            if (prevIndex === 0) return -1;
            return (prevIndex - 1 + buttons.length) % buttons.length;
          });
          break;
        case 'ArrowDown':
          event.preventDefault(); 
          setFocusedButtonIndex((prevIndex) => {
            if (prevIndex === -1) return 0;
            if (prevIndex === 3) return -1;
            return (prevIndex + 1) % buttons.length;
          });
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedButtonIndex !== -1 && buttonRefs.current[focusedButtonIndex].current) {
            buttonRefs.current[focusedButtonIndex].current.click();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [buttons.length, focusedButtonIndex]);

  useEffect(() => {
    if (focusedButtonIndex !== -1 && buttonRefs.current[focusedButtonIndex] && buttonRefs.current[focusedButtonIndex].current) {
      buttonRefs.current[focusedButtonIndex].current.focus();
    } else if (focusedButtonIndex === -1) {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
         document.activeElement.blur();
      }
    }
  }, [focusedButtonIndex]);

  const handleEditProfile = () => {
    setFocusedButtonIndex(-1); 
    const newName = prompt("Enter your new name:", name);
    const newEmail = prompt("Enter your new email:", email);
    if (newName) setName(newName);
    if (newEmail) setEmail(newEmail);
  };

  const resetProfile = () => {
    setFocusedButtonIndex(-1); 
    setName("username");
    setEmail("defult@abc.com");
  };
  
  return (
    <div className="content-page">
      <h2 className="page-title">Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <button 
          className={`profile-button ${focusedButtonIndex === 0 ? 'focused' : ''}`} 
          onClick={handleEditProfile}
          ref={buttonRefs.current[0]}
          tabIndex={focusedButtonIndex === 0 ? 0 : -1}
        >
          Edit Profile
        </button>
        <button 
          className={`profile-button logout-button ${focusedButtonIndex === 1 ? 'focused' : ''}`} 
          onClick={resetProfile}
          ref={buttonRefs.current[1]}
          tabIndex={focusedButtonIndex === 1 ? 0 : -1}
        >
          Log Out
        </button>
      </div>
      <div className="auth-actions">
        <button 
          className={`auth-button ${focusedButtonIndex === 2 ? 'focused' : ''}`} 
          onClick={() => { setFocusedButtonIndex(-1); alert(`You clicked on: Log In`); }}
          ref={buttonRefs.current[2]}
          tabIndex={focusedButtonIndex === 2 ? 0 : -1}
        >
          Log In
        </button> 
        <button 
          className={`auth-button ${focusedButtonIndex === 3 ? 'focused' : ''}`} 
          onClick={() => { setFocusedButtonIndex(-1); alert(`You clicked on: Sign Up`); }}
          ref={buttonRefs.current[3]}
          tabIndex={focusedButtonIndex === 3 ? 0 : -1}
        >
          Sign Up
        </button>
      </div>
      <Navigation/>
    </div>
  );
}

export default ProfilePage;