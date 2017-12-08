import React from 'react';
import RetroWhatsNew from '../retro_whats_new';

function PostfactoHeading() {
    return (
      <div className="postfacto-heading">
        <span className="postfacto-heading-content">
              <div className="postfacto-title">
                <h1>postfacto</h1>
              </div>
              <div className="postfacto-heading-buttons">
                <RetroWhatsNew />
              </div>
            </span>
      </div>
    );
}

export default PostfactoHeading;