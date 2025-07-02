'use client';

import React from 'react';

const SceneControls = () => {
  const controls = [
    { action: 'rotate', icon: '🔄', title: 'Rotate View' },
    { action: 'zoom', icon: '🔍', title: 'Zoom In' },
    { action: 'reset', icon: '🏠', title: 'Reset View' },
    { action: 'fullscreen', icon: '⛶', title: 'Fullscreen' }
  ];

  const handleControlClick = (action: string) => {
    // Implement 3D scene control logic
    // This would integrate with Three.js or similar 3D library
    
    try {
      switch (action) {
        case 'rotate':
          // Trigger automatic scene rotation
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('scene:rotate', { detail: { auto: true } }));
          }
          break;
          
        case 'zoom':
          // Trigger zoom in functionality
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('scene:zoom', { detail: { factor: 1.2 } }));
          }
          break;
          
        case 'reset':
          // Reset view to default position and rotation
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('scene:reset'));
          }
          break;
          
        case 'fullscreen':
          // Toggle fullscreen mode for the 3D scene container
          const sceneContainer = document.querySelector('.scene-container');
          if (sceneContainer) {
            if (!document.fullscreenElement) {
              sceneContainer.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          }
          break;
          
        default:
          console.warn(`Unknown scene control action: ${action}`);
          break;
      }
    } catch (error) {
      console.error('Scene control error:', error);
    }
  };

  return (
    <div className="scene-controls">
      {controls.map((control) => (
        <button
          key={control.action}
          className="control-btn"
          title={control.title}
          onClick={() => handleControlClick(control.action)}
        >
          {control.icon}
        </button>
      ))}
    </div>
  );
};

export default SceneControls;