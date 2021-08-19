import React from 'react';
import ReactDom from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

export default function SideDrawer(props) {
  const nodeRef = React.useRef(null);
  const content = (
    <CSSTransition
      className="slide-in-left"
      in={props.show}
      timeout={200}
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
    >
      <aside className="side-drawer" onClick={props.onClick} ref={nodeRef}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDom.createPortal(content, document.getElementById('drawer-hook'));
}
