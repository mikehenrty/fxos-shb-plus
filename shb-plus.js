(function() {
  function init() {
    const ID_STYLES = 'shb-styles';
    const ID_SHOW_WINDOWS = 'show-windows-button';
    const ID_KILL_WINDOW = 'kill-window-button';

    var buttons = document.getElementById('software-buttons');
    if (!buttons) {
      console.log('shb-plus, no homebar found?');
      return;
    }

    // Clean up any old installs.
    function removeElement(id) {
      var old = document.getElementById(id);
      old && old.remove();
    }
    removeElement(ID_STYLES);
    removeElement(ID_SHOW_WINDOWS);
    removeElement(ID_KILL_WINDOW);

    // Inject inline styles
    var style = document.createElement('style');
    style.id = ID_STYLES;
    style.appendChild(document.createTextNode(`
      #${ID_SHOW_WINDOWS}, #${ID_KILL_WINDOW} {
        position: absolute;
        top: 0;
        height: 5rem;
        width: 7rem;
        padding: 0;
        z-index: 99999999;
        pointer-events: all;
        background: transparent;
        border: none;
        color: white;
        font-size: 3rem;
        font-weight: bold;
      }

      #${ID_SHOW_WINDOWS}:active,
      #${ID_KILL_WINDOW}:active {
        color: #00caf2;
      }

      #${ID_SHOW_WINDOWS} {
        right: 1rem;
      }

      #${ID_KILL_WINDOW} {
        left: 1rem;
      }

      @media (orientation: landscape) {
        #${ID_SHOW_WINDOWS}, #${ID_KILL_WINDOW} {
          width: 100%;
          right: 0;
          left: unset;
        }

        #${ID_SHOW_WINDOWS} {
          top: 1.5rem;
          bottom: unset;
        }

        #${ID_KILL_WINDOW} {
          top: unset;
          bottom: 1.5rem;
        }
      }
    `));
    document.head.appendChild(style);

    var showWindows = document.createElement('button');
    showWindows.id = ID_SHOW_WINDOWS;
    showWindows.textContent = '▢';
    showWindows.addEventListener('touchstart', function() {
      if (window.wrappedJSObject.appWindowManager.taskManager.isShown()) {
        window.wrappedJSObject.appWindowManager.taskManager.hide();
      } else {
        window.dispatchEvent(new CustomEvent('taskmanagershow'));
      }
      if('vibrate' in navigator) {
        // ... vibrate for a second
        navigator.vibrate(50);
      }
    }, true);
    buttons.appendChild(showWindows);

    var kill = document.createElement('button');
    kill.id = ID_KILL_WINDOW;
    kill.textContent = '☠';
    kill.addEventListener('touchstart', function() {
      var oldApp = window.wrappedJSObject.StackManager.getCurrent();
      if (oldApp) {
        window.wrappedJSObject.SheetsTransition.begin('ltr');
        window.wrappedJSObject.SheetsTransition.snapLeft(1);
        window.wrappedJSObject.StackManager.goPrev();
        oldApp.kill();
      }
      if('vibrate' in navigator) {
        // ... vibrate for a second
        navigator.vibrate(50);
      }
    }, true);
    buttons.appendChild(kill);
  }

  // Make sure we have the homebar element before booting.
  if (document.getElementById('software-buttons')) {
    init();
  } else {
    window.addEventListener('mozContentEvent', function readyListener(e) {
      if (e.detail.type === 'system-message-listener-ready') {
        window.removeEventListener('mozContentEvent', readyListener);
        init();
      }
    });
  }

}());
